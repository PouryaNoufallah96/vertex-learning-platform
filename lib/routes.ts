/** The site's URL shapes, in one place so links stay consistent as routes land. */

export const coursesHref = "/courses";

export function courseHref(slug: string) {
  return `/courses/${slug}`;
}

/**
 * A lesson resolves by its own slug — `LESSON_BY_SLUG_QUERY` derives the parent course with a
 * reverse reference, so the URL does not carry the course.
 */
export function lessonHref(slug: string) {
  return `/lessons/${slug}`;
}
