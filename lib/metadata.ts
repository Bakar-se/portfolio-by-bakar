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

/** Metadata for one of the top-level pages listed in config/seo/head.ts. */
export function pageMetadata(page: string): Metadata {
  const head = getPageHead(page);
  return {
    title: head.title,
    description: head.description,
    alternates: { canonical: getBaseUrl(head.slug) },
  };
}
