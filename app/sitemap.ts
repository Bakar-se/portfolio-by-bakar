import { getCaseStudies, getPosts } from "@/lib/content";
import { getBaseUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";

// Google ignores changeFrequency and priority, and only trusts lastModified
// when it is accurate, so static pages leave it out rather than claiming to
// change on every build.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/about", "/projects", "/blog", "/contact"].map(
    (path) => ({ url: getBaseUrl(path) }),
  );

  const posts = getPosts().map((post) => ({
    url: getBaseUrl(`/blog/post/${post.slug}`),
    lastModified: new Date(post.date),
  }));

  const caseStudies = getCaseStudies().map((project) => ({
    url: getBaseUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.date),
  }));

  return [...staticPages, ...posts, ...caseStudies];
}
