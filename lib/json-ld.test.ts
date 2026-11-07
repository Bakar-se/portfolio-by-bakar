import { describe, expect, it } from "vitest";
import { blogPostingJsonLd, personJsonLd } from "./json-ld";

const post = {
  title: "Hello",
  description: "A post",
  date: "2025-02-07",
  category: "Next.js",
  tags: ["Next.js", "React"],
  image: "/content-assets/posts/hello/cover.jpg",
  author: "Muhammad Abu Bakar",
};

describe("blogPostingJsonLd", () => {
  it("describes a Post as a BlogPosting with absolute URLs", () => {
    expect(blogPostingJsonLd(post, "hello")).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Hello",
      url: "https://www.bakar.info/blog/post/hello",
      image: "https://www.bakar.info/content-assets/posts/hello/cover.jpg",
      datePublished: "2025-02-07",
      keywords: "Next.js, React",
    });
  });
});

describe("personJsonLd", () => {
  it("links every profile and keeps the email so people can reach out", () => {
    const person = personJsonLd();
    expect(person.jobTitle).toBe("Software Engineer");
    expect(person.email).toBe("ironsamurai786@gmail.com");
    expect(person.sameAs).toEqual(
      expect.arrayContaining([
        "https://github.com/Bakar-se",
        "https://www.linkedin.com/in/its-bakar/",
        "https://x.com/its_bakar",
      ]),
    );
  });
});
