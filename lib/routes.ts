/** The site's URL shapes, in one place so links stay consistent as routes land. */

export const coursesHref = "/courses";

export function courseHref(slug: string) {
  return `/courses/${slug}`;
}

/**
 * A lesson resolves by its own slug — `LESSON_BY_SLUG_QUERY` derives the parent course with a
 * reverse reference, so the URL does not carry the course.
 *
 * `startSeconds` is the moment a search result matched: the lesson page hands it to the video
 * provider's own start parameter so playback opens at that second (AGENTS.md §7).
 */
export function lessonHref(slug: string, startSeconds?: number | null) {
  if (!startSeconds || startSeconds <= 0) return `/lessons/${slug}`;
  return `/lessons/${slug}?t=${Math.floor(startSeconds)}`;
}

/** The query parameter carrying the start second on a lesson URL. */
export const START_SECONDS_PARAM = "t";
