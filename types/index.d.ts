import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { IconType } from "react-icons";

export type HeadType = {
  page: string;
  title: string;
  slug: string;
  description: string;
};

export type AuthorType = {
  name: string;
  avatar: string;
  twitterUrl: string;
  twitterAddress: string;
  email: string;
};

export type SocialType = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

export type SubMenuItemType = {
  title: string;
  slug: string;
  description: string;
  icon: IconType;
};

export type MenuItemType = {
  emoji: string;
  title: string;
  slug: string;
  description?: string;
  icon?: React.ReactNode;
  subcategories?: SubMenuItemType[];
};

export type PostType = {
  fileName: string;
  content: string;
  mdx?: MDXRemoteSerializeResult;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
};

type SearchResult = {
  id: string;
  metadata: any;
  content: string;
};

export type Heading = {
  level: number;
  text: string;
};

export type CategoryType = {
  name: string;
  slug: string;
  background?: React.ComponentType<{ className?: string }>;
  icon?: React.ComponentType<{ className?: string }>;
  bigIcon?: React.ComponentType<{ className?: string }>;
  description: string;
  weight: number;
};

export type NavigationLink = {
  href: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  subNavigationLinks?: NavigationLink[];
};

