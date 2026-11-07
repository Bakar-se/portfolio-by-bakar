import BlogPostDetailHeading from "@/components/blog/detail-blog-post/heading/blog-post-heading";
import Footer from "@/components/footer/main";
import { DocsLayout } from "@/components/fuma/fuma-layout";
import { DocsBody, DocsPage } from "@/components/fuma/fuma-page";
import Header from "@/components/header/main";
import Heading from "@/components/heading/main";
import { JsonLd } from "@/components/json-ld";
import { MotionEffect } from "@/components/ui/animations/motion-effect";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import {
  getPost,
  getProject,
  getProjectHref,
  type Post,
} from "@/lib/content";
import { blogPostingJsonLd } from "@/lib/json-ld";
import { buildPostMetadata, type PostSeoData } from "@/lib/post-seo";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { MDXContent } from "@content-collections/mdx/react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import readingTime from "reading-time";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

function toPostSeoData(post: Post): PostSeoData {
  return {
    title: post.title,
    description: post.description,
    date: post.date,
    updated: post.updated,
    category: post.category,
    tags: post.tags,
    image: post.image,
    author: post.author,
  };
}

export async function generateStaticParams() {
  return source.generateParams().map((param) => ({
    slug: param.slug[0],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = source.getPage([slug]);
  if (!post) notFound();

  const rawPost = getPost(slug);
  if (!rawPost) notFound();

  return buildPostMetadata(toPostSeoData(rawPost), slug);
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = source.getPage([slug]);
  const rawPost = getPost(slug);

  if (!post || !rawPost) {
    return notFound();
  }

  const seoData = toPostSeoData(rawPost);
  const project = rawPost.project ? getProject(rawPost.project) : undefined;
  const readMinutes = readingTime(rawPost.content, {
    wordsPerMinute: 100,
  }).minutes;

  return (
    <Fragment>
      <JsonLd data={blogPostingJsonLd(seoData, slug)} />
      <Header showProgressBar={true} />
      <Heading variant="blog">
        <MotionEffect
          fade
          blur="10px"
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          inView
        >
          <BlogPostDetailHeading
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            authorImage={post.data.authorAvatar}
            authorName={post.data.author}
            category={post.data.category}
            readTime={readMinutes}
            imageUrl={post.data.image}
            draft={rawPost.draft}
          />
        </MotionEffect>
      </Heading>
      <div className="border-border bg-background relative border-t">
        <div className="mx-auto w-full max-w-5xl">
          {project && (
            <p className="text-muted-foreground mx-auto max-w-3xl px-6 pt-8 text-sm sm:px-4 md:px-0">
              This post is about{" "}
              <Link
                href={getProjectHref(project)}
                className="text-accent-foreground font-medium underline underline-offset-4"
              >
                {project.title}
              </Link>
              .
            </p>
          )}
          <MotionEffect
            fade
            blur="10px"
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            inView
          >
            <DocsLayout tree={source.pageTree}>
              <DocsPage toc={post.data.toc}>
                <DocsBody className="prose">
                  <MDXContent
                    code={post.data.body}
                    components={getMDXComponents()}
                  />
                </DocsBody>
              </DocsPage>
            </DocsLayout>
          </MotionEffect>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </Fragment>
  );
}
