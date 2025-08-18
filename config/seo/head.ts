import { truncateDescription, truncateTitle } from "@/lib/seo";
import type { HeadType } from "@/types";

const HEAD: HeadType[] = [
  {
    page: "Home",
    title: truncateTitle("Looking for the Best Software Engineer? | Hire Bakar"),
    description: truncateDescription(
      "Hire Bakar – A Skilled Software Engineer for Fast, Reliable, and High-Performing Web Applications!",
    ),
    slug: "/",
  },
  {
    page: "About",
    title: truncateTitle("About | Software Engineer for Hire | Bakar"),
    description: truncateDescription(
      "Looking for a top Software Engineer? Hire Bakar.",
    ),
    slug: "/about",
  },
  {
    page: "Story",
    title: truncateTitle("Story | Software Engineer for Hire | Bakar"),
    description: truncateDescription(
      "Learn more about Bakar's journey and experiences as a software engineer.",
    ),
    slug: "/story",
  },
  {
    page: "Blog",
    title: truncateTitle("Blog | Next.js, Tailwind CSS, and Supabase | Bakar"),
    description: truncateDescription("Explore Bakar's latest blog posts"),
    slug: "/blog",
  },
  {
    page: "Projects",
    title: truncateTitle("Projects | Showcasing Bakar's Work | Bakar"),
    description: truncateDescription("Next.js, Tailwind CSS, and Supabase!"),
    slug: "/projects",
  },
  {
    page: "Shoutouts",
    title: truncateTitle("Shoutouts | Feature your post here"),
    description: truncateDescription(
      "Give me a shoutout, and I'll feature your post here!",
    ),
    slug: "/shoutouts",
  },
  {
    page: "Contact",
    title: truncateTitle("Contact | Get in Touch with Bakar"),
    description: truncateDescription(
      "Thinking about hiring Bakar? Drop him a message.",
    ),
    slug: "/contact",
  },
];

export default HEAD;
