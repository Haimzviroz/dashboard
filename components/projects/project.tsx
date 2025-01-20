import { FC, Fragment } from "react"

import ProjectName from '@/components/header/project-name';
import ProjectMembers from "./members/project-members";

import { DetailedProject } from "@/types/interfaces";
import ProjectTokens from "./tokens/token";

interface ProjectProps {
  project: DetailedProject,
}

const Project: FC<ProjectProps> = ({ project }) => {
  return (
    <Fragment>
      <ProjectName project={project} />
      <ProjectMembers project={project} />
      {project.tokens && <ProjectTokens tokens={project.tokens} />}
    </Fragment>
  )
}

export default Project