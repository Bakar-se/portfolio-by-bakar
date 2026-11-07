import { Button } from "@/components/ui/button";
import {
  BookOpenIcon as CaseStudyIcon,
  GithubIcon as CodeIcon,
  ArrowUpRightIcon as LinkIcon,
  ChromeIcon as LiveDemoIcon,
} from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface Props {
  projectTitle: string;
  /** Link to the Project's Case Study page, when it has one. */
  caseStudyUrl?: string;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
}

const outlineClassName =
  "hover:ring-border cursor-pointer overflow-hidden rounded-lg px-5 py-2 [--liquid-button-color:var(--accent)] [background:_linear-gradient(var(--liquid-button-color)_0_0)_no-repeat_calc(200%-var(--liquid-button-fill,0%))_100%/200%_var(--liquid-button-fill,0.2em)] [transition:_background_0.3s_var(--liquid-button-delay,0s),_color_0.3s_var(--liquid-button-delay,0s),_background-position_0.3s_calc(0.3s_-_var(--liquid-button-delay,0s))] hover:ring-2 hover:[--liquid-button-delay:0.3s] hover:[--liquid-button-fill:100%]";

const solidClassName =
  "hover:ring-border px-5 py-2 hover:border-black/20 hover:ring-2 dark:hover:border-white/20";

const LinkButtons: FC<Props> = ({
  projectTitle,
  caseStudyUrl,
  githubUrl,
  liveDemoUrl,
}) => {
  return (
    <div className="mx-auto mt-4 flex w-fit max-w-full flex-wrap justify-center gap-2">
      {caseStudyUrl && (
        <Link href={caseStudyUrl} aria-label={`Read the ${projectTitle} case study`}>
          <Button className={solidClassName}>
            <CaseStudyIcon className="size-4" aria-hidden="true" />
            Case study
          </Button>
        </Link>
      )}
      {githubUrl && (
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View the ${projectTitle} code on GitHub`}
        >
          <Button
            variant={caseStudyUrl ? "outline" : "default"}
            className={caseStudyUrl ? outlineClassName : solidClassName}
          >
            <CodeIcon className="size-4" aria-hidden="true" />
            Code
          </Button>
        </Link>
      )}
      {liveDemoUrl && (
        <Link
          href={liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${projectTitle} live demo`}
        >
          <Button variant="outline" className={outlineClassName}>
            <LiveDemoIcon className="size-4" aria-hidden="true" />
            Live Demo
            <LinkIcon className="size-4" aria-hidden="true" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default LinkButtons;
