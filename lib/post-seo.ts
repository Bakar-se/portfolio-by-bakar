import AUTHOR from "@/config/seo/author";
import { getBaseUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { lastUpdated } from "./content-rules";
import { SITE } from "./metadata";
import { truncateDescription } from "./seo";

export interface PostSeoData {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  image?: string;
  author: string;
}

export function getPostCanonicalUrl(slug: string): string {
  return getBaseUrl(`/blog/post/${slug}`);
}

export function buildPostMetadata(post: PostSeoData, slug: string): Metadata {
  const canonical = getPostCanonicalUrl(slug);
  const ogDescription = truncateDescription(post.description, 200);

  return {
    metadataBase: new URL(getBaseUrl()),
    title: post.title,
    description: post.description,
    authors: [{ name: post.author, url: AUTHOR.twitterUrl }],
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      locale: "en",
      url: canonical,
      title: post.title,
      description: ogDescription,
      siteName: SITE.name,
      publishedTime: post.date,
      modifiedTime: lastUpdated(post),
      authors: [post.author],
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: ogDescription,
      site: AUTHOR.twitterAddress,
      creator: AUTHOR.twitterAddress,
    },
  };
}
