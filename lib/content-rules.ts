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
