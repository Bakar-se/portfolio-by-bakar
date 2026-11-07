import { createMDXSource } from "@fumadocs/content-collections";
import { getPosts } from "@/lib/content";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/blog/post",
  source: createMDXSource(getPosts(), []),
});
