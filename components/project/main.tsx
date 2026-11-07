import Card from "@/components/ui/card";
import DraftBadge from "@/components/ui/draft-badge";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getProjectHref, type Project } from "@/lib/content";
import { FadeUp } from "../ui/animations/fade-up";
import { MotionEffect } from "../ui/animations/motion-effect";
import BrowserWrapper from "./browser";
import Stack from "./stack";
import LinkButtons from "./link-buttons";

interface Props {
  project: Project;
  className?: string;
}

const ProjectImages: FC<{ image: string; title: string }> = ({
  image,
  title,
}) => (
  <>
    <Image
      className="z-1 mx-auto hidden max-w-full grayscale group-hover:grayscale-0 sm:block"
      src={image}
      alt={`Screenshot of ${title}`}
      width={1024}
      height={300}
      priority
      quality={85}
      placeholder="blur"
      blurDataURL={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0ZXh0AAAAAElYAABYWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjVBQVRAQkBAQEBAQED/2wBDAR4eHh0aHTQaGjRAOC40QEA0QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQED/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`}
      sizes="(max-width: 640px) 100vw, 1024px"
    />
    <Image
      className="z-1 mx-auto block max-w-full grayscale group-hover:grayscale-0 sm:hidden"
      src={image}
      alt={`Screenshot of ${title} - Mobile view`}
      width={512}
      height={384}
      quality={85}
      placeholder="blur"
      blurDataURL={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0ZXh0AAAAAElYAABYWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjVBQVRAQkBAQEBAQED/2wBDAR4eHh0aHTQaGjRAOC40QEA0QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQED/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`}
      sizes="(max-width: 640px) 512px, 100vw"
    />
  </>
);

const ProjectItem: FC<Props> = ({ project, className }) => {
  const href = getProjectHref(project);
  const isExternal = /^https?:///.test(href);

  return (
    <FadeUp delay={0.6} duration={0.3}>
      <Card className={className}>
        <MotionEffect
          fade
          blur="10px"
          delay={0.5}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          inView
        >
          <article className="z-1 mx-auto mt-4 gap-x-4 px-8 py-4 pb-3 text-center sm:px-10 sm:pb-0">
            {project.draft && <DraftBadge className="mb-3" />}
            <h2 className="text-accent-foreground text-3xl font-bold tracking-tight text-pretty sm:text-4xl">
              {project.hasCaseStudy ? (
                <Link href={href} className="hover:underline">
                  {project.title}
                </Link>
              ) : (
                project.title
              )}
            </h2>

            <Stack stack={project.stack} className="mx-auto mt-4" />

            {project.description && (
              <p className="text-foreground mx-auto mt-4 max-w-prose text-lg leading-relaxed text-pretty">
                {project.description}
              </p>
            )}

            <LinkButtons
              projectTitle={project.title}
              caseStudyUrl={project.hasCaseStudy ? href : undefined}
              githubUrl={project.githubUrl}
              liveDemoUrl={project.webUrl ?? project.youtubeUrl}
            />
          </article>
        </MotionEffect>
        <div className="mt-6 px-8">
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group"
            aria-label={
              project.hasCaseStudy
                ? `Read the ${project.title} case study`
                : `View ${project.title}`
            }
          >
            <BrowserWrapper>
              <ProjectImages image={project.image} title={project.title} />
            </BrowserWrapper>
          </Link>
        </div>
      </Card>
    </FadeUp>
  );
};

export default ProjectItem;
