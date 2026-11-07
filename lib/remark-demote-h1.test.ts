import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Heading, Root } from "mdast";
import { describe, expect, it } from "vitest";
import { remarkDemoteH1 } from "./remark-demote-h1";

function headingDepths(markdown: string) {
  const processor = unified().use(remarkParse).use(remarkDemoteH1);
  const tree = processor.runSync(processor.parse(markdown)) as Root;
  return tree.children
    .filter((node): node is Heading => node.type === "heading")
    .map((heading) => heading.depth);
}

describe("remarkDemoteH1", () => {
  it("turns body H1s into H2s, since the page renders the title as the H1", () => {
    expect(headingDepths("# Title again\n\n## Section\n\n### Detail")).toEqual(
      [2, 2, 3],
    );
  });

  it("leaves # lines inside code blocks alone", () => {
    expect(headingDepths("```md\n# Not a heading\n```\n\n## Real")).toEqual([
      2,
    ]);
  });
});
