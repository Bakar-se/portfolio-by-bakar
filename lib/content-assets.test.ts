import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  listAssets,
  resolveAssetUrl,
  syncContentAssets,
} from "./content-assets.mjs";

describe("resolveAssetUrl", () => {
  it("maps a sibling file to its served URL", () => {
    expect(resolveAssetUrl("cover.jpg", "posts/hello")).toBe(
      "/content-assets/posts/hello/cover.jpg",
    );
  });

  it("accepts ./ and nested folders", () => {
    expect(resolveAssetUrl("./img/step-1.png", "posts/hello")).toBe(
      "/content-assets/posts/hello/img/step-1.png",
    );
  });

  it("keeps URL-encoded names as they are", () => {
    expect(resolveAssetUrl("Pasted%20image.png", "posts/hello")).toBe(
      "/content-assets/posts/hello/Pasted%20image.png",
    );
  });

  it.each([
    "/images/cover.jpg",
    "https://example.com/a.png",
    "http://example.com/a.png",
    "data:image/png;base64,AAAA",
    "#heading",
    "mailto:me@example.com",
  ])("leaves %s untouched", (url) => {
    expect(resolveAssetUrl(url, "posts/hello")).toBe(url);
  });

  it("rejects paths that escape the content folder", () => {
    expect(() => resolveAssetUrl("../../../secret.png", "posts/hello")).toThrow(
      /outside the content folder/,
    );
  });
});

describe("content asset sync", () => {
  let root: string;
  let contentRoot: string;
  let outDir: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "content-assets-"));
    contentRoot = join(root, "content");
    outDir = join(root, "public", "content-assets");
    mkdirSync(join(contentRoot, "posts", "hello", "img"), { recursive: true });
    mkdirSync(join(contentRoot, ".obsidian"), { recursive: true });
    mkdirSync(join(contentRoot, "_templates"), { recursive: true });
    writeFileSync(join(contentRoot, "posts", "hello", "index.md"), "# Hi");
    writeFileSync(join(contentRoot, "posts", "hello", "cover.jpg"), "jpg");
    writeFileSync(join(contentRoot, "posts", "hello", "img", "a.png"), "png");
    writeFileSync(join(contentRoot, ".obsidian", "icon.png"), "png");
    writeFileSync(join(contentRoot, "_templates", "x.png"), "png");
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("lists only asset files, skipping hidden and underscore folders", () => {
    expect(listAssets(contentRoot).sort()).toEqual([
      "posts/hello/cover.jpg",
      "posts/hello/img/a.png",
    ]);
  });

  it("copies assets and removes ones that no longer exist", () => {
    mkdirSync(join(outDir, "posts", "gone"), { recursive: true });
    writeFileSync(join(outDir, "posts", "gone", "old.png"), "old");

    syncContentAssets({ contentRoot, outDir });

    expect(readdirSync(join(outDir, "posts", "hello")).sort()).toEqual([
      "cover.jpg",
      "img",
    ]);
    expect(readdirSync(join(outDir, "posts"))).toEqual(["hello"]);
  });
});
