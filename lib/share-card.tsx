// The Share Card image: what LinkedIn, X and others show when a link to the
// site is shared. One design for the whole site, rendered by the
// `opengraph-image.tsx` / `twitter-image.tsx` files next to each route.

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "./metadata";

export const SHARE_CARD_SIZE = { width: 1200, height: 630 };
export const SHARE_CARD_CONTENT_TYPE = "image/png";

const COLORS = {
  background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
  text: "#fafafa",
  muted: "#a1a1aa",
  subtle: "#d4d4d8",
};

async function loadPhoto(): Promise<string> {
  const photo = await readFile(join(process.cwd(), "public", "pic.jpg"));
  return `data:image/jpeg;base64,${photo.toString("base64")}`;
}

/** Geist from Google Fonts; falls back to the default font if offline. */
async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Geist:wght@700&display=swap",
    ).then((res) => res.text());
    const url = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

async function render(children: React.ReactElement) {
  const font = await loadFont();
  return new ImageResponse(children, {
    ...SHARE_CARD_SIZE,
    fonts: font
      ? [{ name: "Geist", data: font, style: "normal", weight: 700 }]
      : undefined,
  });
}

/** The site's own card: photo, name and headline. */
export async function siteShareCard() {
  const photo = await loadPhoto();
  return render(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 56,
        padding: "0 80px",
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: "Geist",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt=""
        width={240}
        height={240}
        style={{ borderRadius: 9999, border: "6px solid #3f3f46" }}
      />
      <div
        style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}
      >
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.05 }}>
          {SITE.name}
        </div>
        <div style={{ fontSize: 40, color: COLORS.subtle }}>
          {SITE.headline}
        </div>
        <div style={{ fontSize: 28, color: COLORS.muted, marginTop: 24 }}>
          bakar.info
        </div>
      </div>
    </div>,
  );
}

/** A card for a Post or Case Study: what it is, its title, and who wrote it. */
export async function contentShareCard({
  kind,
  title,
  detail,
}: {
  /** Shown top right, e.g. a Post's category or "Case Study". */
  kind: string;
  title: string;
  /** One line under the title, e.g. tags or the Stack. */
  detail?: string;
}) {
  const photo = await loadPhoto();
  return render(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: COLORS.muted,
        }}
      >
        <span>bakar.info</span>
        <span>{kind}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: title.length > 60 ? 56 : 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {detail ? (
          <div style={{ fontSize: 28, color: COLORS.subtle }}>{detail}</div>
        ) : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          width={64}
          height={64}
          style={{ borderRadius: 9999 }}
        />
        <span style={{ fontSize: 28, color: COLORS.muted }}>
          {SITE.name} · {SITE.headline}
        </span>
      </div>
    </div>,
  );
}
