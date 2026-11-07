// The one place pages read Posts and Projects from. Ordering (and, later,
// Draft visibility) is decided here so every page, feed and sitemap agrees.

import {
  allPosts,
  allProjects,
  type Post,
  type Project,
} from "content-collections";
import { newestFirst } from "./content-rules";

export type { Post, Project };

/** Every Post, newest first. */
export function getPosts(): Post[] {
  return newestFirst(allPosts);
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/** Every Project, newest first. */
export function getProjects(): Project[] {
  return newestFirst(allProjects);
}

/** Projects shown on the home page and in the projects menu. */
export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

/** Where a Project card or menu item links to. */
export function getProjectHref(project: Project): string {
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
