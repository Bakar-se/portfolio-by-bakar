// Structured data (schema.org JSON-LD) so search engines understand who the
// site belongs to and what each Post is.

import AUTHOR from "@/config/seo/author";
import socialConfig from "@/config/social";
import { getBaseUrl } from "@/lib/utils";
import { lastUpdated } from "./content-rules";
import { SITE } from "./metadata";
import type { PostSeoData } from "./post-seo";

function absolute(url: string) {
  return /^https?:\/\//.test(url) ? url : getBaseUrl(url);
}

export function blogPostingJsonLd(post: PostSeoData, slug: string) {
  const url = getBaseUrl(`/blog/post/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: absolute(post.image ?? AUTHOR.avatar),
    datePublished: post.date,
    dateModified: lastUpdated(post),
    author: {
      "@type": "Person",
      name: post.author,
      url: getBaseUrl(),
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
  const profiles = socialConfig
    .map((social) => social.href)
    .filter((href) => href.startsWith("http"));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    url: getBaseUrl(),
    image: getBaseUrl(AUTHOR.avatar),
    sameAs: [...new Set([...profiles, AUTHOR.twitterUrl])],
    // Kept on purpose so people can reach out.
    email: AUTHOR.email,
    jobTitle: SITE.headline,
  };
}
