import { describe, expect, it } from "vitest";
import { pageMetadata } from "./metadata";

describe("pageMetadata", () => {
  it("gives the page its own Share Card, not the home page's", () => {
    const metadata = pageMetadata("Projects");

    expect(metadata.alternates?.canonical).toBe(
      "https://www.bakar.info/projects",
    );
    expect(metadata.openGraph).toMatchObject({
      url: "https://www.bakar.info/projects",
      title: "Projects · Bakar",
      description: "Things I've built, and the stack behind each one.",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Projects · Bakar",
      description: "Things I've built, and the stack behind each one.",
    });
  });

  it("uses the site Share Card image, since setting openGraph drops the inherited one", () => {
    const metadata = pageMetadata("About");

    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 }),
    ]);
    expect(metadata.twitter?.images).toEqual([
      expect.objectContaining({ url: "/twitter-image" }),
    ]);
  });

  it("throws for a page missing from the SEO config", () => {
    expect(() => pageMetadata("Nope")).toThrow(/No SEO entry/);
  });
});
