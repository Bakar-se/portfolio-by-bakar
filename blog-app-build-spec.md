# bakar.info Blog — Fix & Extend Spec

## Context

This is **not** a greenfield build. A blog already exists at `/blog`, built on `content-collections` + Fumadocs, with shadcn/ui, Tailwind v4, sitemap/robots/RSS already in place. This spec is a punch list to fix known issues and add the missing pieces (dynamic OG images, JSON-LD, full SSG, better RSS) — not a rebuild.

**Decision: keep content-collections + Fumadocs. Do not migrate to Velite.** Fumadocs is already wired into the root layout and post rendering; swapping it out is a large-risk rewrite for a content pipeline that already works. Everything below extends the existing stack.

Stack as-is (don't change): Next.js 15.3.8, React 19, App Router, TypeScript strict, Tailwind v4 (CSS-first config), shadcn/ui (`new-york` style), `content-collections` + Fumadocs, `feed` package for RSS, `next-themes`, Geist via `next/font`.

---

## Priority 0 — Fix before adding anything new

These are active bugs, not enhancements. Fix first so new work isn't built on broken foundations.

1. **Pick one package manager.** Three lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) exist simultaneously. Pick one, delete the other two lockfiles, add a `packageManager` field to `package.json`.
2. **Fix the domain mismatch.** `getBaseUrl()` defaults to `its-bakar.com`; contact config references `bakar.info`. Set `NEXT_PUBLIC_BASE_URL=https://bakar.info` explicitly and audit every place `getBaseUrl()` or a hardcoded domain is used (metadata, OG images, sitemap, RSS, JSON-LD once added).
3. **Fix the `SingleBlogPost` data-shape mismatch.** `app/blog/page.tsx` passes Fumadocs-shaped `post.data` into a component expecting `_meta.path` and `content`. Trace this and correct whichever side is wrong.
4. **Resolve the dual content-collection setup.** `content/posts/` is currently read by two separate definitions — a `posts` collection (used by RSS/sitemap/search) and a `docs` collection (used by Fumadocs' blog UI). Consolidate to one collection definition feeding both the UI and the feeds, so frontmatter/schema changes don't need to happen in two places.
5. **Remove or wire up dead code**: the `NavigationBlog` mega-menu references `/blog/category/*` routes that don't exist — either build category routes (see Nice-to-haves) or strip the dead dropdown code. Also remove the unused `components/blog/detail-blog-post/main.tsx` if `SingleBlogPost` fix in #3 makes it redundant.
6. **Fix the sitemap's dead `/resume` entry** — either add a redirect from `/resume` to `/files/CV.pdf`, or remove the sitemap entry.
7. **Migrate `next.config.mjs` images config** from deprecated `domains: ["pbs.twimg.com"]` to `remotePatterns`, and add `formats: ["image/avif", "image/webp"]`.
8. **Compress the two oversized PNGs in `public/`** (`image1.png` ~9MB, `image2.png` ~6.4MB) — these are actively hurting Core Web Vitals wherever they're rendered. Convert to WebP/AVIF and resize to actual display dimensions.

---

## Priority 1 — Missing pieces from your original requirements

### Full static generation
Add `generateStaticParams` to `app/blog/post/[slug]/page.tsx` so all posts are pre-rendered at build time instead of relying on default dynamic behavior — this is the single biggest lever for both SEO and load speed on post pages.

### Dynamic OG images
Currently OG images are static site-wide images plus a per-post `image` frontmatter field — there's no generated-per-post OG image. Add `app/og/[slug]/route.tsx` using `next/og`'s `ImageResponse` to generate a branded image per post (title + tags + your name), and wire it into each post's `generateMetadata` for `openGraph.images` and `twitter.images`. Ensure image URLs are absolute (use the corrected `NEXT_PUBLIC_BASE_URL`), and set `metadataBase` consistently on the blog post route — the audit found this isn't always set.

### JSON-LD structured data
None currently exists. Add `Article` JSON-LD (`headline`, `datePublished`, `dateModified`, `image`, `author`) to each post page, and consider `Person` JSON-LD on the root layout / about page for E-E-A-T signal.

### Twitter/X card completeness
Confirm `generateMetadata` on post pages sets:
```ts
twitter: {
  card: 'summary_large_image',
  title: post.title,
  description: post.description,
  images: [ogImageUrl],
}
```

### RSS improvements for dev.to / daily.dev
The existing `/rss.xml` route (via the `feed` package) needs: full post content (not just excerpt) in the feed item, categories/tags per item, and an `/feed.xml` alias if you want the more conventional URL for aggregator submission. Also delete the stale `public/rss-feed.xml` static file so it can't be served by mistake.

### Per-post metadata completeness
Ensure every post's `generateMetadata` includes `publishedTime`, `authors`, and `tags` in the `openGraph.article` fields — currently inconsistent per the audit.

---

## Priority 2 — Performance

- **Reduce the client-heavy shell**: `Header` is `"use client"` on every page, and `MotionEffect` wraps most page content. Audit whether the whole header needs to be client — likely only the theme switcher, search command palette, and mobile menu toggle need it; the rest can stay server-rendered.
- **Scope `TanStackQueryProvider`**: it currently wraps the entire app but is only needed for search. Move it to wrap just the search command palette instead of the root layout, so pages that don't use search skip that JS.
- **Confirm `next/image` usage stays consistent** as new components (OG route, category pages) are added — audit found no raw `<img>` tags currently, keep it that way.
- **Re-check Core Web Vitals after the PNG compression and header scoping above** — those two changes alone should move LCP and TBT meaningfully.

---

## Nice-to-haves (later, not required now)

- Build out `/blog/category/[slug]` routes to match the nav config that already references them (or remove the reference if categories aren't a priority)
- Search index tuning now that `TanStackQueryProvider` is scoped down
- `scripts/crosspost.ts` to push new posts to dev.to/Hashnode via API with `canonical_url` pointing back to `bakar.info`

---

## Sharing behavior (confirm, don't rebuild)

X and LinkedIn sharing both work off correct Open Graph / Twitter Card metadata — once Priority 1's OG image + metadata work is done, sharing should render correctly with no separate share-button component required for the metadata side. If you want on-page share buttons (X intent link, LinkedIn share-offsite link, copy-link), that's a small addition using existing shadcn `Button` + `sonner` (already installed) — not a new dependency.

---

## Instructions for Cursor

1. Work through **Priority 0** fully first — these are correctness bugs, not features, and later work depends on the content pipeline being consolidated and the domain being consistent.
2. Then **Priority 1** — generateStaticParams, dynamic OG route, JSON-LD, metadata completeness, RSS improvements.
3. Then **Priority 2** — performance pass on the client-heavy shell and image sizes.
4. Leave **Nice-to-haves** until the above is done and deployed.
5. After each priority tier, run a build and manually check: does `/blog`, an individual post, `/sitemap.xml`, `/robots.txt`, and `/rss.xml` all still work correctly before moving to the next tier.
