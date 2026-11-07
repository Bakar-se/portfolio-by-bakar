import type { HeadType } from "@/types";

/**
 * Title and description for each top-level page. Titles are short: the root
 * layout's title template adds " · Bakar" (see lib/metadata.ts).
 */
const HEAD: HeadType[] = [
  {
    page: "Home",
    title: "Muhammad Abu Bakar · Software Engineer",
    description:
      "I'm Muhammad Abu Bakar, a software engineer. I write about what I'm learning and share the projects I've built.",
    slug: "/",
  },
  {
    page: "About",
    title: "About",
    description:
      "Who I am, what I've worked on, and the tools I like to build with.",
    slug: "/about",
  },
  {
    page: "Blog",
    title: "Blog",
    description:
      "Posts on Next.js, React, Tailwind CSS and whatever else I'm learning as a software engineer.",
    slug: "/blog",
  },
  {
    page: "Projects",
    title: "Projects",
    description: "Things I've built, and the stack behind each one.",
    slug: "/projects",
  },
  {
    page: "Shoutouts",
    title: "Shoutouts",
    description:
      "Posts people have shared about my work. Give me a shoutout and I'll feature yours here.",
    slug: "/shoutouts",
  },
  {
    page: "Contact",
    title: "Contact",
    description:
      "Questions, work, or just saying hi: send me a message and I'll get back to you.",
    slug: "/contact",
  },
];

export default HEAD;
