import type { ProjectMenuItem } from "@/lib/content";
import { ArchiveIcon as AllProjectsIcon } from "lucide-react";
import { FC } from "react";
import MoreProjectItem from "./more-project-item";
import ProjectItem from "./project-item";

interface Props {
  projects: ProjectMenuItem[];
}

const NavigationProjects: FC<Props> = ({ projects }) => {
  return (
    <div className="divide-border grid w-[1024px] grid-cols-[70%_30%] divide-x">
      <div className="grid grid-cols-2 gap-4 p-4">
        {projects.slice(0, 4).map((project) => (
          <ProjectItem
            key={project.title}
            title={project.title}
            description={project.description}
            href={project.href}
            image={project.image}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 px-6 py-4">
        <p className="text-muted-foreground mb-2 text-xs uppercase">
          More Projects
        </p>
        <div className="flex flex-col gap-0.5">
          {projects.slice(4).map((project) => (
            <MoreProjectItem
              key={project.title}
              title={project.title}
              href={project.href}
              description={project.description}
            />
          ))}
          <MoreProjectItem
            title="All Projects"
            href="/projects"
            icon={AllProjectsIcon}
            description="Everything I've built"
          />
        </div>
      </div>
    </div>
  );
};

export default NavigationProjects;
