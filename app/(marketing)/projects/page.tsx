import Footer from "@/components/footer/main";
import Header from "@/components/header/main";
import Heading from "@/components/heading/main";
import ProjectItem from "@/components/project/main";
import { MotionEffect } from "@/components/ui/animations/motion-effect";
import MainTitle from "@/components/ui/main-title";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { getPageHead, pageMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/content";
import { Metadata } from "next";
import { Fragment } from "react";

const PAGE = "Projects";
const page = getPageHead(PAGE);

export const metadata: Metadata = pageMetadata(PAGE);

export default async function ProjectPage() {
  const projects = getProjects();

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
            className="mx-auto mt-6 mb-14 max-w-3xl px-4 sm:px-6 lg:px-8"
          />
        </MotionEffect>
      </Heading>
      <div className="border-border bg-background relative min-h-[50vh] max-w-full border-t">
        <div className="relative mx-auto -mt-12 max-w-3xl px-4 sm:px-6 lg:px-8">
          {projects.map((project) => (
            <ProjectItem
              key={project.slug}
              project={project}
              className="mb-8"
            />
          ))}
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </Fragment>
  );
}
