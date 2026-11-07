import AUTHOR from "@/config/seo/author";
import { getBaseUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { SITE } from "./metadata";
import { truncateDescription } from "./seo";

export interface PostSeoData {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
  author: string;
}

export function getPostOgImageUrl(slug: string): string {
  return getBaseUrl(`/og/${slug}`);
}

export function getPostCanonicalUrl(slug: string): string {
  return getBaseUrl(`/blog/post/${slug}`);
}

export function buildPostMetadata(post: PostSeoData, slug: string): Metadata {
  const ogImageUrl = getPostOgImageUrl(slug);
  const canonical = getPostCanonicalUrl(slug);
  const ogDescription = truncateDescription(post.description, 200);

  return {
    metadataBase: new URL(getBaseUrl()),
    title: post.title,
    description: post.description,
    keywords: post.tags.join(", "),
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
      modifiedTime: post.date,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: ogDescription,
      site: AUTHOR.twitterAddress,
      creator: AUTHOR.twitterAddress,
      images: [ogImageUrl],
    },
  };
}
