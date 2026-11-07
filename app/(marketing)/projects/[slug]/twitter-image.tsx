import { getCaseStudies, getProject } from "@/lib/content";
import {
  contentShareCard,
  SHARE_CARD_CONTENT_TYPE,
  SHARE_CARD_SIZE,
} from "@/lib/share-card";
import { notFound } from "next/navigation";

export const alt = "Case Study";
export const size = SHARE_CARD_SIZE;
export const contentType = SHARE_CARD_CONTENT_TYPE;

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.hasCaseStudy) notFound();

  return contentShareCard({
    kind: "Case Study",
    title: project.title,
    detail: project.stack.join("  ·  "),
  });
}
