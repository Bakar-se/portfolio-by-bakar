import SingleBlogPost from "@/components/blog/single-blog-post/main";
import Footer from "@/components/footer/main";
import Header from "@/components/header/main";
import Heading from "@/components/heading/main";
import BrowserWrapper from "@/components/project/browser";
import LinkButtons from "@/components/project/link-buttons";
import Stack from "@/components/project/stack";
import { MotionEffect } from "@/components/ui/animations/motion-effect";
import DraftBadge from "@/components/ui/draft-badge";
import MainTitle from "@/components/ui/main-title";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import {
  describeProject,
  getCaseStudies,
  getPostsAbout,
  getProject,
} from "@/lib/content";
import { getBaseUrl } from "@/lib/utils";
import { getMDXComponents } from "@/mdx-components";
import { MDXContent } from "@content-collections/mdx/react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Fragment } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

function getCaseStudy(slug: string) {
  const project = getProject(slug);
  return project?.hasCaseStudy ? project : undefined;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) notFound();

  const url = getBaseUrl(`/projects/${project.slug}`);
  const description = describeProject(project);
  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: project.title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) notFound();

  const posts = getPostsAbout(project);

  return (
    <Fragment>
      <Header />
      <Heading variant="default">
        <MotionEffect
          fade
          blur="10px"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          inView
        >
          {project.draft && (
            <div className="mt-6 flex justify-center">
              <DraftBadge />
            </div>
          )}
          <MainTitle
            title={project.title}
            description={describeProject(project)}
            className="mx-auto mt-6 mb-4 max-w-3xl px-4 sm:px-6 lg:px-8"
          />
          <Stack stack={project.stack} className="mx-auto mb-14 px-4" />
        </MotionEffect>
      </Heading>
      <div className="border-border bg-background relative min-h-[50vh] max-w-full border-t">
        <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <BrowserWrapper>
            <Image
              className="mx-auto max-w-full"
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              width={1024}
              height={600}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </BrowserWrapper>
          <LinkButtons
            projectTitle={project.title}
            githubUrl={project.githubUrl}
            liveDemoUrl={project.webUrl ?? project.youtubeUrl}
          />

          <article className="prose dark:prose-invert mx-auto mt-10">
            <MDXContent code={project.mdx} components={getMDXComponents()} />
          </article>

          {posts.length > 0 && (
            <section className="mt-16" aria-labelledby="related-posts">
              <h2
                id="related-posts"
                className="text-accent-foreground mb-6 text-2xl font-bold tracking-tight"
              >
                Posts about {project.title}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {posts.map((post) => (
                  <SingleBlogPost key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </Fragment>
  );
}
