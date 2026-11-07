import AUTHOR from "@/config/seo/author";
import { getBaseUrl } from "@/lib/utils";
import type { PostSeoData } from "./post-seo";

export function articleJsonLd(post: PostSeoData, slug: string) {
  const url = getBaseUrl(`/blog/post/${slug}`);
  const image = post.image?.startsWith("http")
    ? post.image
    : getBaseUrl(post.image ?? "/pic.jpg");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: AUTHOR.twitterUrl,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR.name,
      url: getBaseUrl(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: post.tags.join(", "),
    articleSection: post.category,
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    url: getBaseUrl(),
    sameAs: [AUTHOR.twitterUrl, "https://www.linkedin.com/in/its-bakar/"],
    email: AUTHOR.email,
    jobTitle: "Software Engineer",
  };
}
