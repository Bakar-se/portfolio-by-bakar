import { cn } from "@/lib/utils";
import { FC } from "react";

/** Marks a Draft. Drafts only render in `next dev`, so this never ships. */
const DraftBadge: FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-amber-500/60 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-amber-900 uppercase dark:bg-amber-900/40 dark:text-amber-200",
      className,
    )}
  >
    Draft
  </span>
);

export default DraftBadge;
