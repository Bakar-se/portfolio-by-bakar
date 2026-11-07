import { createBuilder } from "@content-collections/core";
import { join } from "node:path";
import {
  syncContentAssets,
  watchContentAssets,
} from "./lib/content-assets.mjs";

const command = process.argv.slice(2).find((arg) => !arg.startsWith("-"));

/**
 * Build Posts and Projects before Next.js starts, then watch them in dev.
 *
 * This replaces `withContentCollections` from `@content-collections/next`,
 * which logs content errors but lets `next build` succeed without the broken
 * document. Here any content error (bad frontmatter, a stray `{` in Markdown)
 * fails the production build and names the file; in dev it is only logged.
 */
async function buildContent() {
  // Next.js loads this config in several processes; build content once.
  if (globalThis.__contentBuilt) return;
  globalThis.__contentBuilt = true;

  // Copy images that live beside Posts and Projects into `public/` before the
  // content build runs. Draft images are only copied in dev, matching where
  // Drafts are shown.
  const contentAssets = {
    contentRoot: join(process.cwd(), "content"),
    outDir: join(process.cwd(), "public", "content-assets"),
    includeDrafts: command === "dev",
  };
  syncContentAssets(contentAssets);

  const builder = await createBuilder(
    join(process.cwd(), "content-collections.ts"),
  );
  const errors = [];
  builder.on("builder:end", ({ stats }) => {
    console.log(`Content: built ${stats.documents} documents`);
  });
  builder.on("_error", (event) => {
    const where = event.file?.path ?? event.filePath;
    const message = `${where ? `${where}: ` : ""}${event.error.message}`;
    console.error(`Content error (${event._event}) ${message}`);
    errors.push(message);
  });

  await builder.build();

  if (command === "build" && errors.length > 0) {
    throw new Error(
      `Content build failed with ${errors.length} error(s):\n${errors.join("\n")}`,
    );
  }

  if (command === "dev") {
    watchContentAssets(contentAssets);
    await builder.watch();
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/files/CV.pdf",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/docs/posts/:slug*",
        destination: "/blog/post/:slug*",
        permanent: true,
      },
    ];
  },
};

export default async function config() {
  if (command === "build" || command === "dev") {
    await buildContent();
  }
  return nextConfig;
}
