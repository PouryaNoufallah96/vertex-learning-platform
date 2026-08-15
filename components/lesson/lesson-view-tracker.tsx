"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface LessonViewTrackerProps {
  lessonSlug: string;
  lessonLabel: string | null;
  courseSlug: string | null;
}

/** Captures the lesson view once per mount (AGENTS.md §7 engagement events). */
export function LessonViewTracker({ lessonSlug, lessonLabel, courseSlug }: LessonViewTrackerProps) {
  useEffect(() => {
    posthog.capture("lesson_viewed", {
      lesson_slug: lessonSlug,
      lesson_label: lessonLabel,
      course_slug: courseSlug,
    });
  }, [lessonSlug, lessonLabel, courseSlug]);

  return null;
}
