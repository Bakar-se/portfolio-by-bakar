// Images and other files that live next to a Post or Project in `content/`.
//
// Obsidian can only preview files inside the Vault (`content/`), so assets sit
// beside the Markdown that uses them. At build (and while `next dev` runs) they
// are mirrored into `public/content-assets/`, and relative links in Markdown and
// frontmatter are rewritten to those served URLs.
//
// Plain JavaScript so `next.config.mjs` can import it directly.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  watch,
} from "node:fs";
import { dirname, join, posix, relative, sep } from "node:path";
import { visit } from "unist-util-visit";

export const ASSET_URL_PREFIX = "/content-assets";

const ASSET_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".mp4",
  ".pdf",
  ".png",
  ".svg",
  ".webm",
  ".webp",
]);

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i;

/** @param {string} name */
function isAsset(name) {
  const dot = name.lastIndexOf(".");
  return dot > 0 && ASSET_EXTENSIONS.has(name.slice(dot).toLowerCase());
}

/** Folders the site never publishes: `.obsidian`, `_templates`, and the like. */
function isSkippedFolder(name) {
  return name.startsWith(".") || name.startsWith("_");
}

/**
 * Whether a folder holds a Draft: its `index.md` (or `.mdx`) frontmatter says
 * `draft: true`. Draft images stay out of production builds.
 *
 * @param {string} dir
 */
function isDraftFolder(dir) {
  for (const name of ["index.md", "index.mdx"]) {
    const file = join(dir, name);
    if (!existsSync(file)) continue;
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(
      readFileSync(file, "utf8"),
    );
    return /^draft:\s*true\s*$/m.test(frontmatter?.[1] ?? "");
  }
  return false;
}

/**
 * Turn a link written relative to a document into the URL it is served at.
 * Absolute paths, full URLs and anchors are returned unchanged.
 *
 * @param {string} url - the link as written, e.g. `cover.jpg` or `./img/a.png`
 * @param {string} documentDir - the document's folder relative to `content/`, e.g. `posts/hello`
 * @returns {string}
 */
export function resolveAssetUrl(url, documentDir) {
  if (!url || ABSOLUTE_URL.test(url)) return url;

  const joined = posix.normalize(posix.join(documentDir, url));
  if (joined === ".." || joined.startsWith("../")) {
    throw new Error(
      `"${url}" in ${documentDir} points outside the content folder`,
    );
  }
  return `${ASSET_URL_PREFIX}/${joined}`;
}

/**
 * Remark plugin: rewrite relative image links in a document.
 *
 * @param {{ documentDir: string }} options
 */
export function remarkContentAssets({ documentDir }) {
  return (tree) => {
    visit(tree, "image", (node) => {
      node.url = resolveAssetUrl(node.url, documentDir);
    });
  };
}

/**
 * Every asset under `contentRoot`, as posix paths relative to it. Assets in a
 * Draft's folder are left out unless `includeDrafts` is set.
 *
 * @param {string} contentRoot
 * @param {{ includeDrafts?: boolean }} [options]
 * @returns {string[]}
 */
export function listAssets(contentRoot, { includeDrafts = false } = {}) {
  /** @type {string[]} */
  const found = [];
  const walk = (dir) => {
    if (!includeDrafts && isDraftFolder(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!isSkippedFolder(entry.name)) walk(join(dir, entry.name));
      } else if (isAsset(entry.name)) {
        found.push(relative(contentRoot, join(dir, entry.name)).split(sep).join("/"));
      }
    }
  };
  if (existsSync(contentRoot)) walk(contentRoot);
  return found;
}

/**
 * Mirror the assets in `contentRoot` into `outDir`: copy new or changed files
 * and delete files whose source is gone.
 *
 * @param {{ contentRoot: string, outDir: string, includeDrafts?: boolean }} options
 */
export function syncContentAssets({ contentRoot, outDir, includeDrafts }) {
  const assets = new Set(listAssets(contentRoot, { includeDrafts }));

  for (const asset of assets) {
    const from = join(contentRoot, asset);
    const to = join(outDir, asset);
    const source = statSync(from);
    if (existsSync(to)) {
      const target = statSync(to);
      if (target.size === source.size && target.mtimeMs >= source.mtimeMs) {
        continue;
      }
    }
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
  }

  const prune = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        prune(path);
        if (readdirSync(path).length === 0) rmSync(path, { recursive: true });
      } else {
        const asset = relative(outDir, path).split(sep).join("/");
        if (!assets.has(asset)) rmSync(path);
      }
    }
  };
  if (existsSync(outDir)) prune(outDir);
}

/**
 * Keep `outDir` in sync while `contentRoot` changes. Used by `next dev`.
 *
 * @param {{ contentRoot: string, outDir: string, includeDrafts?: boolean }} options
 */
export function watchContentAssets(options) {
  /** @type {NodeJS.Timeout | undefined} */
  let timer;
  return watch(options.contentRoot, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        syncContentAssets(options);
      } catch (error) {
        console.error("Failed to sync content assets:", error);
      }
    }, 100);
  });
}
