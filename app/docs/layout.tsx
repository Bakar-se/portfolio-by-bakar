import { RootProvider } from "fumadocs-ui/provider";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootProvider>{children}</RootProvider>;
}
