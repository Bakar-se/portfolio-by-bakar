"use client";

import Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "../ui/animations/fade-up";
import { MotionEffect } from "../ui/animations/motion-effect";
import "react-photo-view/dist/react-photo-view.css";

const PhotoProvider = dynamic(
  () => import("react-photo-view").then((mod) => mod.PhotoProvider),
  { ssr: false },
);
const PhotoView = dynamic(
  () => import("react-photo-view").then((mod) => mod.PhotoView),
  { ssr: false },
);

interface Props {
  className?: string;
}

const Intro = ({ className }: Props) => {
  return (
    <FadeUp delay={0.6} duration={0.3}>
      <Card className={cn(className)}>
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

          <div className="mx-auto mt-6 max-w-2xl px-6 text-center md:px-2 lg:px-2">
            <h2 className="text-accent-foreground mb-4 text-2xl font-bold sm:text-3xl">
              Oh Hello There!
            </h2>
            <div className="text-foreground space-y-6 text-lg leading-8">
              <p className="text-foreground text-md text-center sm:text-left sm:text-lg">
                I&apos;m{" "}
                <span className="text-accent-foreground font-medium">
                  Muhammad Abu Bakar
                </span>{" "}
                (preferred name:{" "}
                <span className="text-accent-foreground font-medium">Bakar</span>
                ). I&apos;m a{" "}
                <span className="text-accent-foreground font-medium">
                  Software Engineer
                </span>{" "}
                with{" "}
                <span className="text-accent-foreground font-medium">
                  3+ years
                </span>{" "}
                of experience in{" "}
                <span className="text-accent-foreground font-medium">
                  React, Next.js, TailwindCSS, JavaScript, and TypeScript
                </span>
                . I live in{" "}
                <span className="text-accent-foreground font-medium">
                  Gujrat, Pakistan.
                  </span>
              </p>
              <p className="text-foreground text-md text-center sm:text-left sm:text-lg">
                Originally from{" "}
                <span className="text-accent-foreground font-medium">
                  Pakistan
                </span>
                , I studied Software Engineering at the{" "}
                <Link
                  href="https://www.hs-mittweida.de/en/"
                  className="text-accent-foreground hover:text-accent-foreground/80 font-medium underline underline-offset-4"
                  target="_blank"
                >
                  University of Gujrat
                </Link>{" "}
                in Pakistan and speak{" "}
                <span className="text-accent-foreground font-medium">
                  English
                </span>
                ,{" "}
                <span className="text-accent-foreground font-medium">
                Urdu
                </span>
                , and{" "}
                <span className="text-accent-foreground font-medium">
                Punjabi
                </span>
                .
              </p>
              <p className="text-foreground text-md text-center sm:text-left sm:text-lg">
                I constantly improve my skills by reading & watching{" "}
                <span className="text-accent-foreground font-medium">
                  Blogs, Books, and YouTube Videos
                </span>{" "}
                .
              </p>
              <p className="text-foreground text-md text-center sm:text-left sm:text-lg">
                Currently, I&apos;m building{" "} a Saas application
                to help{" "}
                <span className="text-md">
                  Gym owners track their members, generate reports, and manage their business. 
                </span>{" "}(Coming Soon)
              </p>
              <p className="text-foreground text-md mb-10 text-center sm:text-left sm:text-lg">
                Please find below my selected{" "}
                <Link
                  href="/projects"
                  className="text-accent-foreground hover:text-accent-foreground/80 font-medium underline underline-offset-4"
                >
                  works
                </Link>
                , and you can view my{" "}
                <Link
                  href="/files/CV.pdf"
                  className="text-accent-foreground hover:text-accent-foreground/80 font-medium underline underline-offset-4"
                  target="_blank"
                >
                  resume here
                </Link>
                .
              </p>
            </div>
          </div>
        </MotionEffect>
      </Card>
    </FadeUp>
  );
};

export default Intro;
