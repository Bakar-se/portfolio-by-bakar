"use client";

import ProgressBar from "@/components/header/progress-bar";
import type { ProjectMenuItem } from "@/lib/content";
import { usePathname } from "next/navigation";
import { FC } from "react";
import DesktopHeader from "./desktop/desktop-header";
import MobileHeader from "./mobile/mobile-header";

interface Props {
  showProgressBar?: boolean;
  featuredProjects: ProjectMenuItem[];
}

const HeaderClient: FC<Props> = ({
  showProgressBar = false,
  featuredProjects,
}) => {
  const path = usePathname();

  return (
    <>
      <DesktopHeader activePath={path} featuredProjects={featuredProjects} />
      <MobileHeader currentPath={path} />
      {showProgressBar && <ProgressBar />}
    </>
  );
};

export default HeaderClient;
