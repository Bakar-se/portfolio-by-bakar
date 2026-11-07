import AUTHOR from "@/config/seo/author";
import { getPosts } from "@/lib/content";
import { getBaseUrl } from "@/lib/utils";
import { Feed } from "feed";
import { lastUpdated } from "./content-rules";
import { markdownToFeedHtml } from "./feed-html";
import { SITE } from "./metadata";

/**
 * The blog's RSS and Atom feed. Each item carries the full Post as HTML, so
 * it reads well in feed readers and imports cleanly into dev.to.
 */
export function createBlogFeed() {
  const posts = getPosts();
  const baseUrl = getBaseUrl();
  const latest = posts.map(lastUpdated).sort().at(-1);

  const feed = new Feed({
    title: `${SITE.name}'s Blog`,
    description: `Posts by ${SITE.name}, ${SITE.headline.toLowerCase()}`,
    id: getBaseUrl("/"),
    link: getBaseUrl("/blog"),
    language: "en",
    image: getBaseUrl(AUTHOR.avatar),
    favicon: getBaseUrl("/icon"),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR.name}`,
    updated: latest ? new Date(latest) : undefined,
    feedLinks: {
      rss: getBaseUrl("/rss.xml"),
      atom: getBaseUrl("/feed.xml"),
    },
    author: {
      name: AUTHOR.name,
      email: AUTHOR.email,
      link: baseUrl,
    },
  });

  for (const post of posts) {
    const postUrl = getBaseUrl(`/blog/post/${post.slug}`);
    const coverImage = /^https?:\/\//.test(post.image)
      ? post.image
      : getBaseUrl(post.image);
    const body = markdownToFeedHtml(post.content, {
      documentDir: post.documentDir,
      baseUrl,
    });

    feed.addItem({
      title: post.title,
      // The Post's URL on the site is its id and canonical link.
      id: postUrl,
      link: postUrl,
      description: post.description,
      content: `<p><img src="${coverImage}" alt="" /></p>\n${body}`,
      author: [
        {
          name: post.author,
          email: AUTHOR.email,
          link: baseUrl,
        },
      ],
      date: new Date(lastUpdated(post)),
      published: new Date(post.date),
      image: coverImage,
      category: [
        { name: post.category, term: post.category },
        ...post.tags.map((tag) => ({ name: tag, term: tag })),
      ],
    });
  }

  return feed;
}
