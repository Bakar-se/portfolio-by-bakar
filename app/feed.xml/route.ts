import { createBlogFeed } from "@/lib/rss";

export async function GET() {
  const feed = createBlogFeed();

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
