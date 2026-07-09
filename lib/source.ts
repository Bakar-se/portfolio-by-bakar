import { createMDXSource } from "@fumadocs/content-collections";
import { allMetas, allPosts } from "content-collections";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/blog/post",
  source: createMDXSource(allPosts, allMetas),
});
