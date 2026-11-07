import { cn } from "@/lib/utils";
import { FC } from "react";

interface Props {
  stack: string[];
  className?: string;
}

/** The technologies a Project was built with. */
const Stack: FC<Props> = ({ stack, className }) => {
  return (
    <ul
      className={cn("flex flex-wrap justify-center gap-2", className)}
      aria-label="Built with"
    >
      {stack.map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-black/20 px-3 py-1 text-sm tracking-tight dark:border-white/20"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
};

export default Stack;
