import SingleBlogPostLoading from "@/components/blog/single-blog-post/loading";
import SingleBlogPost from "@/components/blog/single-blog-post/main";
import Footer from "@/components/footer/main";
import Header from "@/components/header/main";
import Heading from "@/components/heading/main";
import { MotionEffect } from "@/components/ui/animations/motion-effect";
import MainTitle from "@/components/ui/main-title";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { getPageHead, pageMetadata } from "@/lib/metadata";
import { getPosts } from "@/lib/content";
import { Metadata } from "next";
import { Fragment, Suspense } from "react";

const PAGE = "Blog";
const page = getPageHead(PAGE);

export const metadata: Metadata = pageMetadata(PAGE);

export default async function BlogPage() {
  const posts = getPosts();

  return (
    <Fragment>
      <Header />
      <Heading variant="default">
        <MotionEffect
          fade
          blur="10px"
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          inView
        >
          <MainTitle
            title={page.page}
            description={page.description}
            className="mx-auto mt-6 mb-4 max-w-3xl px-4 sm:px-6 lg:px-8"
          />
        </MotionEffect>
      </Heading>
      <div className="border-border bg-background relative min-h-[50vh] max-w-full border-t">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-3 py-10 md:grid-cols-3 lg:px-4 xl:px-0">
          {posts?.map((post, index) => (
            <MotionEffect
              key={post.slug}
              fade
              zoom
              inView
              delay={0.1 + index * 0.1}
            >
              <Suspense fallback={<SingleBlogPostLoading />}>
                <SingleBlogPost post={post} />
              </Suspense>
            </MotionEffect>
          ))}
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </Fragment>
  );
}
