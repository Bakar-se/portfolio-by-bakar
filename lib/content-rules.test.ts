import { describe, expect, it } from "vitest";
import { newestFirst } from "./content-rules";

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
