"use client";

import ProgressBar from "@/components/header/progress-bar";
import { usePathname } from "next/navigation";
import { FC } from "react";
import DesktopHeader from "./desktop/desktop-header";
import MobileHeader from "./mobile/mobile-header";

interface Props {
  showProgressBar?: boolean;
}

const HeaderClient: FC<Props> = ({ showProgressBar = false }) => {
  const path = usePathname();

  return (
    <>
      <DesktopHeader activePath={path} />
      <MobileHeader currentPath={path} />
      {showProgressBar && <ProgressBar />}
    </>
  );
};

export default HeaderClient;
