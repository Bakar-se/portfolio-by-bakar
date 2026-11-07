import { describe, expect, it } from "vitest";
import { markdownToFeedHtml } from "./feed-html";

const render = (markdown: string) =>
  markdownToFeedHtml(markdown, {
    documentDir: "posts/hello",
    baseUrl: "https://www.bakar.info",
  });

describe("markdownToFeedHtml", () => {
  it("renders lists, emphasis and inline code", () => {
    const html = render("- **bold** item\n- `code` item\n\n_soft_");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li><strong>bold</strong> item</li>");
    expect(html).toContain("<li><code>code</code> item</li>");
    expect(html).toContain("<em>soft</em>");
  });

  it("renders fenced code blocks with their language", () => {
    expect(render("```ts\nconst a = 1 < 2;\n```")).toContain(
      '<pre><code class="language-ts">const a = 1 &#x3C; 2;\n</code></pre>',
    );
  });

  it("makes links and co-located images absolute", () => {
    const html = render(
      "[Blog](/blog) and [elsewhere](https://example.com)\n\n![Shot](step-1.png)",
    );
    expect(html).toContain('href="https://www.bakar.info/blog"');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain(
      'src="https://www.bakar.info/content-assets/posts/hello/step-1.png"',
    );
  });

  it("supports GitHub-flavoured tables", () => {
    expect(render("| a | b |\n| - | - |\n| 1 | 2 |")).toContain("<table>");
  });

  it("drops raw HTML instead of passing it to feed readers", () => {
    expect(render('Hi <script>alert("x")</script>')).not.toContain("<script>");
  });
});
