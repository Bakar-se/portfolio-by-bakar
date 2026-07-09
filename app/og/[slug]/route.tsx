import { allPosts } from "content-collections";
import { ImageResponse } from "next/og";

export const runtime = "edge";

async function loadFont() {
  const response = await fetch(
    "https://fonts.googleapis.com/css2?family=Geist:wght@600;700&display=swap",
  );
  const css = await response.text();
  const match = css.match(
    /src: url\((.+)\) format\('(?:opentype|truetype)'\)/,
  );
  if (!match?.[1]) {
    return null;
  }
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

function getPostBySlug(slug: string) {
  return allPosts.find(
    (post) => post._meta.path.replace(/\.mdx?$/, "") === slug,
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const fontData = await loadFont();
  const tags = post.tags.slice(0, 4).join("  ·  ");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          padding: "64px",
          color: "#fafafa",
          fontFamily: fontData ? "Geist" : "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#a1a1aa",
          }}
        >
          <span>bakar.info</span>
          <span>{post.category}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
          >
            {post.title}
          </div>
          {tags ? (
            <div style={{ fontSize: 28, color: "#d4d4d8" }}>{tags}</div>
          ) : null}
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa" }}>{post.author}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [
            {
              name: "Geist",
              data: fontData,
              style: "normal",
              weight: 700,
            },
          ]
        : undefined,
    },
  );
}
