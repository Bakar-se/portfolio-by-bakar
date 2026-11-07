import { getPost, getPosts } from "@/lib/content";
import {
  contentShareCard,
  SHARE_CARD_CONTENT_TYPE,
  SHARE_CARD_SIZE,
} from "@/lib/share-card";
import { notFound } from "next/navigation";

export const alt = "Post";
export const size = SHARE_CARD_SIZE;
export const contentType = SHARE_CARD_CONTENT_TYPE;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return contentShareCard({
    kind: post.category,
    title: post.title,
    detail: post.tags.slice(0, 4).join("  ·  "),
  });
}
