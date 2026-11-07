import TailwindIndicator from "@/components/ui/tailwind-indicator";
import { JsonLd } from "@/components/json-ld";
import { AUTHOR } from "@/config/seo";
import { personJsonLd } from "@/lib/json-ld";
import { getPageHead, SITE, TITLE_TEMPLATE } from "@/lib/metadata";
import { cn, getBaseUrl } from "@/lib/utils";
import "@/styles/tailwind.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { Metadata, Viewport } from "next";
import { Geist as FontSans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

// The home page uses the root layout's metadata as-is.
const page = getPageHead("Home");

// Configure the Geist font with Latin subset and variable font support
// This sets up the primary font for the application
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Configure viewport settings for responsive design
// This ensures proper scaling and display on different devices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

// Configure comprehensive metadata for SEO and social sharing
// This includes all necessary meta tags for search engines and social media platforms
export const metadata: Metadata = {
  // Basic metadata. Other pages set a short title, e.g. "Blog · Bakar".
  title: {
    default: page.title,
    template: TITLE_TEMPLATE,
  },
  description: page.description,
  referrer: "origin-when-cross-origin",

  // Author information for content attribution
  authors: [
    {
      name: AUTHOR.name,
      url: AUTHOR.twitterUrl,
    },
  ],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,

  // URL configurations for canonical links and RSS feed
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: getBaseUrl(),
    types: {
      "application/rss+xml": `${getBaseUrl("/rss.xml")}`,
      "application/atom+xml": `${getBaseUrl("/feed.xml")}`,
    },
  },

  // Apple web app configuration for iOS devices
  appleWebApp: {
    title: SITE.shortName,
    statusBarStyle: "default",
    capable: true,
  },

  // Search engine crawling configuration
  robots: {
    index: true,
    follow: true,
  },

  // Share Card for the home page. Its image comes from app/opengraph-image.tsx;
  // other pages set their own title, description and URL (see lib/metadata.ts).
  openGraph: {
    type: "website",
    locale: "en",
    url: getBaseUrl(),
    title: page.title,
    description: page.description,
    siteName: SITE.name,
  },

  twitter: {
    card: "summary_large_image",
    title: page.title,
    description: page.description,
    site: AUTHOR.twitterAddress,
    creator: AUTHOR.twitterAddress,
  },
};

// Root layout component that wraps all pages
// This component provides the basic HTML structure and global providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
      suppressHydrationWarning={true}
    >
      <body
        className={cn(
          "dark:selection:bg-sunset-500 bg-white antialiased selection:bg-blue-500 selection:text-white dark:bg-zinc-900",
          fontSans.variable,
        )}
        suppressHydrationWarning={true}
      >
        <JsonLd data={personJsonLd()} />
        <NuqsAdapter>
          <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
              {/* Vercel Analytics for tracking */}
              <Analytics />
              {/* Tailwind CSS breakpoint indicator (development only) */}
              <TailwindIndicator />
            </ThemeProvider>
        </NuqsAdapter>
        {/* Toast notifications provider */}
        <Toaster />
      </body>
    </html>
  );
}
