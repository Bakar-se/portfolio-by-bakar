// The one place pages read Posts and Projects from. Ordering and Draft
// visibility are decided here so every page, feed, sitemap and search agrees.

import {
  allPosts,
  allProjects,
  type Post,
  type Project,
} from "content-collections";
import { newestFirst, postsAbout, visible } from "./content-rules";

export type { Post, Project };

/** Drafts are shown while running `next dev` and hidden everywhere else. */
export const showDrafts = process.env.NODE_ENV === "development";

/** Every Post, newest first. */
export function getPosts(): Post[] {
  return newestFirst(visible(allPosts, { showDrafts }));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/** Every Project, newest first. */
export function getProjects(): Project[] {
  return newestFirst(visible(allProjects, { showDrafts }));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

/** Projects with a Case Study page at `/projects/<slug>`. */
export function getCaseStudies(): Project[] {
  return getProjects().filter((project) => project.hasCaseStudy);
}

/** The Posts about a Project, newest first. */
export function getPostsAbout(project: Project): Post[] {
  return postsAbout(getPosts(), project.slug);
}

/** A one-line summary of a Project, for metadata and Share Cards. */
export function describeProject(project: Project): string {
  return (
    project.description ??
    `${project.title}, built with ${project.stack.join(", ")}.`
  );
}

/** Projects shown on the home page and in the projects menu. */
export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

/**
 * Where a Project card or menu item links to: its Case Study if it has one,
 * otherwise the live site, code or video.
 */
export function getProjectHref(project: Project): string {
  if (project.hasCaseStudy) return `/projects/${project.slug}`;
  return (
    project.webUrl ?? project.githubUrl ?? project.youtubeUrl ?? "/projects"
  );
}

/** The slice of a Featured Project the client-side projects menu needs. */
export type ProjectMenuItem = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export function getProjectMenuItems(): ProjectMenuItem[] {
  return getFeaturedProjects().map((project) => ({
    title: project.title,
    description: project.stack.join(", "),
    image: project.image,
    href: getProjectHref(project),
  }));
}
