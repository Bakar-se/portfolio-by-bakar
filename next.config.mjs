import { withContentCollections } from "@content-collections/next";

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
