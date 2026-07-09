import { createBlogFeed } from "@/lib/rss";

export async function GET() {
  const feed = createBlogFeed();

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
