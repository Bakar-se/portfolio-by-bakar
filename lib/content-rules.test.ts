import { describe, expect, it } from "vitest";
import {
  hasCaseStudy,
  newestFirst,
  postsAbout,
  visible,
} from "./content-rules";

describe("newestFirst", () => {
  it("orders by date, newest first", () => {
    const items = [
      { title: "Old", date: "2023-01-01" },
      { title: "New", date: "2025-06-01" },
      { title: "Middle", date: "2024-03-15" },
    ];
    expect(newestFirst(items).map((i) => i.title)).toEqual([
      "New",
      "Middle",
      "Old",
    ]);
  });

  it("breaks ties on the same date by title", () => {
    const items = [
      { title: "Bravo", date: "2023-07-01" },
      { title: "alpha", date: "2023-07-01" },
    ];
    expect(newestFirst(items).map((i) => i.title)).toEqual(["alpha", "Bravo"]);
  });

  it("does not mutate the input", () => {
    const items = [
      { title: "A", date: "2020-01-01" },
      { title: "B", date: "2021-01-01" },
    ];
    newestFirst(items);
    expect(items[0]!.title).toBe("A");
  });
});

describe("visible", () => {
  const items = [
    { title: "Live", draft: false },
    { title: "WIP", draft: true },
  ];

  it("hides Drafts when drafts are not shown", () => {
    expect(visible(items, { showDrafts: false }).map((i) => i.title)).toEqual([
      "Live",
    ]);
  });

  it("keeps Drafts when drafts are shown", () => {
    expect(visible(items, { showDrafts: true })).toHaveLength(2);
  });
});

describe("hasCaseStudy", () => {
  it("is true when the Project has body text", () => {
    expect(hasCaseStudy({ content: "\n## The problem\n\nWords." })).toBe(true);
  });

  it("is false for an empty or whitespace-only body", () => {
    expect(hasCaseStudy({ content: "" })).toBe(false);
    expect(hasCaseStudy({ content: "\r\n  \n" })).toBe(false);
  });
});

describe("postsAbout", () => {
  it("returns only the Posts linked to the Project", () => {
    const posts = [
      { title: "A", project: "brain-wave" },
      { title: "B" },
      { title: "C", project: "slite" },
      { title: "D", project: "brain-wave" },
    ];
    expect(postsAbout(posts, "brain-wave").map((p) => p.title)).toEqual([
      "A",
      "D",
    ]);
  });
});
