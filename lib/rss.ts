import AUTHOR from "@/config/seo/author";
import { getBaseUrl } from "@/lib/utils";
import { allPosts } from "content-collections";
import { Feed } from "feed";

function markdownToHtml(content: string): string {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("# ")) {
        return `<h1>${trimmed.slice(2)}</h1>`;
      }
      if (trimmed.startsWith("## ")) {
        return `<h2>${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith("### ")) {
        return `<h3>${trimmed.slice(4)}</h3>`;
      }
      if (trimmed.startsWith("```")) {
        const code = trimmed.replace(/^```[^\n]*\n?/, "").replace(/```$/, "");
        return `<pre><code>${code}</code></pre>`;
      }
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

export function createBlogFeed() {
  const posts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const feed = new Feed({
    title: "Bakar's Blog",
    description: "Latest blog posts from Muhammad Abu Bakar",
    id: getBaseUrl(),
    link: getBaseUrl("/blog"),
    language: "en",
    image: getBaseUrl("/pic.jpg"),
    favicon: getBaseUrl("/pic.jpg"),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR.name}`,
    updated: posts[0] ? new Date(posts[0].date) : new Date(),
    feedLinks: {
      rss: getBaseUrl("/rss.xml"),
      atom: getBaseUrl("/feed.xml"),
    },
    author: {
      name: AUTHOR.name,
      email: AUTHOR.email,
      link: getBaseUrl(),
    },
  });

  posts.forEach((post) => {
    const slug = post.slug;
    const postUrl = getBaseUrl(`/blog/post/${slug}`);
    const coverImage = post.image.startsWith("http")
      ? post.image
      : getBaseUrl(post.image);

    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.description,
      content: `<article>
        <img src="${coverImage}" alt="${post.title}" />
        ${markdownToHtml(post.content)}
      </article>`,
      author: [
        {
          name: post.author,
          email: AUTHOR.email,
          link: AUTHOR.twitterUrl,
        },
      ],
      date: new Date(post.date),
      image: coverImage,
      category: [
        { name: post.category },
        ...post.tags.map((tag) => ({ name: tag })),
      ],
    });
  });

  return feed;
}
