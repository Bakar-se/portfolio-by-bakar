// Rules for which content the site shows and in what order. Kept free of the
// generated `content-collections` module so they can be unit tested.

type Dated = { date: string; title: string };

/** Newest first; items from the same day are ordered by title. */
export function newestFirst<T extends Dated>(items: readonly T[]): T[] {
  return [...items].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
  );
}

/** Drafts live beside published content but only show when asked for. */
export function visible<T extends { draft: boolean }>(
  items: readonly T[],
  { showDrafts }: { showDrafts: boolean },
): T[] {
  return items.filter((item) => showDrafts || !item.draft);
}
