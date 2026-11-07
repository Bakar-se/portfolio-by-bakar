import AUTHOR from "@/config/seo/author";
import { remarkContentAssets, resolveAssetUrl } from "@/lib/content-assets.mjs";
import { slugify } from "@/lib/utils";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { transformMDX } from "@fumadocs/content-collections/configuration";
import { posix } from "node:path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeParseCodeBlocks } from "./shiki-rehype.mjs";

type ContentMeta = {
  directory: string;
  fileName: string;
  filePath: string;
  path: string;
};

/**
 * Where a document lives and what it is called on the site. A document is
 * either `<slug>/index.md` (with its images beside it) or a bare `<slug>.md`.
 */
function locate(collection: "posts" | "projects", meta: ContentMeta) {
  // content-collections reports native separators; the site needs `/`.
  const toPosix = (path: string) => path.replace(/\\/g, "/");
  const isIndex = /^index\.mdx?$/.test(meta.fileName);
  const slug = toPosix(isIndex ? meta.directory : meta.path);
  const documentDir = posix.join(collection, toPosix(meta.directory));
  return {
    slug,
    documentDir,
    sourcePath: `content/${collection}/${toPosix(meta.filePath)}`,
  };
}

/**
 * Drafts are only shown in `next dev`, so production builds skip compiling
 * their bodies: an unfinished Draft can't break a deploy, and its images
 * (which aren't copied to `public/` in production) are never looked up.
 */
const compileDrafts =
  process.argv.slice(2).find((arg) => !arg.startsWith("-")) === "dev";

function bodyToCompile<D extends { draft: boolean; content: string }>(doc: D) {
  return doc.draft && !compileDrafts ? { ...doc, content: "" } : doc;
}

/** Name the file in compile errors, so a stray `{` or `<` is easy to find. */
async function compiling<T>(sourcePath: string, run: () => Promise<T>) {
  try {
    return await run();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to compile ${sourcePath}: ${reason}`);
  }
}

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: ["**/*.md", "**/*.mdx"],
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    author: z.string().default(AUTHOR.name),
    authorAvatar: z.string().default(AUTHOR.avatar),
    date: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const { slug, documentDir, sourcePath } = locate("posts", document._meta);

    const transformed = await compiling(sourcePath, () =>
      transformMDX(bodyToCompile(document), context, {
        remarkPlugins: (plugins) => [
          [remarkContentAssets, { documentDir }],
          ...plugins,
        ],
        rehypePlugins: (plugins) => [
          ...plugins,
          rehypeParseCodeBlocks,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ["anchor"],
              },
            },
          ],
        ],
      }),
    );

    const regXHeader = /^(?:[\n\r]|)(?<flag>#{1,6})\s+(?<content>.+)/gm;
    const headings = Array.from(document.content.matchAll(regXHeader)).map(
      ({ groups }) => {
        const flag = groups?.flag;
        const content = groups?.content;
        return {
          level: flag?.length,
          text: content,
          slug: slugify(content ?? "#"),
        };
      },
    );

    return {
      ...transformed,
      slug,
      image: resolveAssetUrl(document.image, documentDir),
      headings,
    };
  },
});

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: ["**/*.md", "**/*.mdx"],
  schema: (z) => ({
    title: z.string(),
    stack: z.array(z.string()),
    date: z.string(),
    image: z.string(),
    featured: z.boolean(),
    draft: z.boolean().default(false),
    webUrl: z.string().nullable(),
    youtubeUrl: z.string().nullable(),
    githubUrl: z.string().nullable(),
  }),
  transform: async (document, context) => {
    const { slug, documentDir, sourcePath } = locate(
      "projects",
      document._meta,
    );

    const mdx = await compiling(sourcePath, () =>
      compileMDX(context, bodyToCompile(document), {
        remarkPlugins: [[remarkContentAssets, { documentDir }]],
        rehypePlugins: [rehypeParseCodeBlocks],
      }),
    );

    return {
      ...document,
      slug,
      image: resolveAssetUrl(document.image, documentDir),
      mdx,
    };
  },
});

export default defineConfig({
  collections: [posts, projects],
});
