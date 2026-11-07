import { withContentCollections } from "@content-collections/next";
import { join } from "node:path";
import {
  syncContentAssets,
  watchContentAssets,
} from "./lib/content-assets.mjs";

// Copy images that live beside Posts and Projects into `public/` before the
// content build runs, and keep them in sync while `next dev` is running.
const contentAssets = {
  contentRoot: join(process.cwd(), "content"),
  outDir: join(process.cwd(), "public", "content-assets"),
};
syncContentAssets(contentAssets);

const command = process.argv.slice(2).find((arg) => !arg.startsWith("-"));
if (command === "dev" && !globalThis.__contentAssetsWatcher) {
  globalThis.__contentAssetsWatcher = watchContentAssets(contentAssets);
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

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
