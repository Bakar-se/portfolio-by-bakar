import type { Root } from "mdast";
import { visit } from "unist-util-visit";

/**
 * Remark plugin: a Post page already renders its title as the page's only H1,
 * so any `# Heading` in the body becomes `## Heading`.
 */
export function remarkDemoteH1() {
  return (tree: Root) => {
    visit(tree, "heading", (node) => {
      if (node.depth === 1) node.depth = 2;
    });
  };
}
