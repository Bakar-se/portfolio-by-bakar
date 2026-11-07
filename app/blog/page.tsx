import SingleBlogPostLoading from "@/components/blog/single-blog-post/loading";
import SingleBlogPost from "@/components/blog/single-blog-post/main";
import Footer from "@/components/footer/main";
import Header from "@/components/header/main";
import Heading from "@/components/heading/main";
import { MotionEffect } from "@/components/ui/animations/motion-effect";
import MainTitle from "@/components/ui/main-title";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { HEAD } from "@/config/seo";
import { getBaseUrl } from "@/lib/utils";
import { HeadType } from "@/types";
import { allPosts } from "content-collections";
import { Metadata } from "next";
import { Fragment, Suspense } from "react";

if (!HEAD || HEAD.length === 0) {
  console.error("⚠️ HEAD configuration is missing or empty");
}

const PAGE = "Blog";
const page = HEAD.find((page: HeadType) => page.page === PAGE) as HeadType;

export const metadata: Metadata = {
  title: page.title,
  applicationName: page.title,
  description: page.description,
  metadataBase: new URL(getBaseUrl(page.slug)),
  alternates: {
    canonical: getBaseUrl(page.slug),
  },
};

export default async function BlogPage() {
  const posts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

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
