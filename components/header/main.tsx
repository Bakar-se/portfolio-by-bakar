import HeaderClient from "@/components/header/header-client";
import { FC } from "react";

interface Props {
  showProgressBar?: boolean;
}

const Header: FC<Props> = ({ showProgressBar = false }) => {
  return (
    <div className="bg-background border-border/50 sticky inset-x-0 top-0 z-50 h-auto items-center border-b">
      <div className="relative mx-auto w-full px-3 lg:px-4 xl:px-0">
        <HeaderClient showProgressBar={showProgressBar} />
      </div>
    </div>
  );
};

export default Header;
