import AUTHOR from "@/config/seo/author";
import HEAD from "@/config/seo/head";
import type { HeadType } from "@/types";
import type { Metadata } from "next";
import { getBaseUrl } from "./utils";

/** The site's identity, used for titles, Share Cards and structured data. */
export const SITE = {
  name: AUTHOR.name,
  shortName: "Bakar",
  headline: "Software Engineer",
} as const;

/** The title template every page except the home page uses. */
export const TITLE_TEMPLATE = `%s · ${SITE.shortName}`;

export function getPageHead(page: string): HeadType {
  const head = HEAD.find((entry) => entry.page === page);
  if (!head) throw new Error(`No SEO entry for page "${page}" in config/seo/head.ts`);
  return head;
}

/**
 * Metadata for one of the top-level pages listed in config/seo/head.ts.
 *
 * Each page sets its own Open Graph and X fields. Without them Next.js reuses
 * the root layout's, and every shared link shows the home page's title and
 * URL. Setting them also drops the image inherited from
 * `app/opengraph-image.tsx`, so the site Share Card is linked explicitly.
 */
export function pageMetadata(page: string): Metadata {
  const head = getPageHead(page);
  const url = getBaseUrl(head.slug);
  // Title templates don't apply to Open Graph titles, so add the suffix here.
  const shareTitle = TITLE_TEMPLATE.replace("%s", head.title);
  const imageAlt = `${SITE.name}, ${SITE.headline}`;
  return {
    title: head.title,
    description: head.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en",
      siteName: SITE.name,
      url,
      title: shareTitle,
      description: head.description,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: imageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: AUTHOR.twitterAddress,
      creator: AUTHOR.twitterAddress,
      title: shareTitle,
      description: head.description,
      images: [{ url: "/twitter-image", alt: imageAlt }],
    },
  };
}
