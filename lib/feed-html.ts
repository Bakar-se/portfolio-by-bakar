// Full HTML for RSS and Atom feed items. Feed readers and dev.to's RSS import
// (used for Cross-posts) show this as the article, so it uses the same
// Markdown rules as the site and only absolute URLs.

import type { Element, Root } from "hast";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { remarkContentAssets } from "./content-assets.mjs";
import { remarkDemoteH1 } from "./remark-demote-h1";

/** Rehype plugin: turn site-relative `href` and `src` into full URLs. */
function rehypeAbsoluteUrls({ baseUrl }: { baseUrl: string }) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      for (const attribute of ["href", "src"]) {
        const value = node.properties[attribute];
        if (typeof value === "string" && value.startsWith("/")) {
          node.properties[attribute] = `${baseUrl}${value}`;
        }
      }
    });
  };
}

/**
 * @param markdown - a Post's body
 * @param options.documentDir - the Post's folder relative to `content/`, for co-located images
 * @param options.baseUrl - the site's URL, e.g. `https://www.bakar.info`
 */
export function markdownToFeedHtml(
  markdown: string,
  { documentDir, baseUrl }: { documentDir: string; baseUrl: string },
): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkContentAssets, { documentDir })
      .use(remarkDemoteH1)
      // Raw HTML in Markdown is dropped rather than passed to feed readers.
      .use(remarkRehype)
      .use(rehypeAbsoluteUrls, { baseUrl })
      .use(rehypeStringify)
      .processSync(markdown),
  );
}
