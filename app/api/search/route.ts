import { openai } from "@ai-sdk/openai";
import type { MCPClient } from "@ai-sdk/mcp";
import { auth } from "@clerk/nextjs/server";
import { generateText, Output, stepCountIs } from "ai";
import type { NextRequest } from "next/server";

import { groundHits } from "@/lib/search/ground";
import { createSearchMcpClient, fetchInitialContext } from "@/lib/search/mcp";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/search/system-prompt";
import {
  ModelAnswerSchema,
  SearchRequestSchema,
  type SearchResponse,
} from "@/lib/search/types";
import { getPostHogClient } from "@/lib/posthog-server";

/**
 * The search API (AGENTS.md §5): connects to the Sanity Context MCP, injects the schema and the
 * system prompt, calls the LLM, then grounds whatever comes back against the dataset before it is
 * returned. Everything token-bearing stays here — the browser only ever sees the JSON below.
 *
 * The route is read-only: no write token, no mutation tool, and the Context document's filter scopes
 * what the model can even see.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The tool loop needs room to query, re-query on a miss, and answer — but no more. A learner is
 * waiting, and every extra step is another round trip.
 */
const MAX_STEPS = 6;

const DEFAULT_MODEL = "gpt-5";

function errorResponse(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "Expected a JSON body.");
  }

  const parsedRequest = SearchRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return errorResponse(400, "Expected { query: string, sort?: 'relevance' | 'newest' | 'duration' }.");
  }

  const { query, sort } = parsedRequest.data;

  let mcpClient: MCPClient | null = null;

  try {
    const [client, initialContext] = await Promise.all([
      createSearchMcpClient(),
      fetchInitialContext(),
    ]);
    mcpClient = client;

    // `initial_context` is dropped: its payload is already in the system prompt, so keeping the tool
    // only invites a redundant round trip (§12 — never hand the model more context than it needs).
    const mcpTools = await mcpClient.tools();
    const tools = Object.fromEntries(
      Object.entries(mcpTools).filter(([name]) => name !== "initial_context"),
    );

    const { output } = await generateText({
      model: openai(process.env.OPENAI_SEARCH_MODEL || DEFAULT_MODEL),
      system: buildSystemPrompt(initialContext),
      prompt: buildUserPrompt(query),
      tools,
      stopWhen: stepCountIs(MAX_STEPS),
      output: Output.object({ schema: ModelAnswerSchema }),
      abortSignal: request.signal,
      // Search is latency-sensitive and the reasoning here is shallow: write one GROQ query, rank
      // what comes back. Heavy reasoning pushed a single search past a minute.
      providerOptions: { openai: { reasoningEffort: "low", textVerbosity: "low" } },
    });

    const results = await groundHits(output.hits, sort);

    const response: SearchResponse = {
      query,
      sort,
      count: results.length,
      courseCount: new Set(results.map((result) => result.courseSlug)).size,
      reply: output.reply,
      results,
    };

    await captureSearch(query, response);

    return Response.json(response);
  } catch (error) {
    // The message can carry the MCP URL or a provider payload, so it is logged, never returned.
    console.error("[api/search]", error);

    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("Missing environment variable")) {
      return errorResponse(500, "Search is not configured.");
    }

    return errorResponse(502, "Search is unavailable right now. Please try again.");
  } finally {
    await mcpClient?.close();
  }
}

/** "A search performed" is one of the engagement moments §7 asks for. */
async function captureSearch(query: string, response: SearchResponse) {
  const posthog = getPostHogClient();
  if (!posthog) return;

  const { userId } = await auth();

  posthog.capture({
    distinctId: userId ?? "anonymous",
    event: "search_performed",
    properties: {
      query,
      sort: response.sort,
      result_count: response.count,
      course_count: response.courseCount,
      video_result_count: response.results.filter((result) => result.kind === "video").length,
    },
  });
}
