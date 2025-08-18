import { cn } from "@/lib/utils";
import { FC } from "react";

interface Props {
  category: string;
  className?: string;
}

const Category: FC<Props> = ({ category, className }) => {

  return (
    <div
      className={cn(
        "relative mx-auto inline-flex items-center justify-center gap-x-1 rounded-full border border-black/20 px-4 py-2 tracking-tight transition-colors hover:border-black/30",
        className,
      )}
      role="status"
      aria-label={`Project category: ${category}`}
    >
      <span>{category}</span>
    </div>
  );
};

export default Category;
