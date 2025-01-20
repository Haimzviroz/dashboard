import { FC, Fragment } from "react"

import ProjectName from '@/components/header/project-name';
import ProjectMembers from "./members/project-members";
import ProjectTokens from "./project-tokens";

import { DetailedProject } from "@/types/interfaces";

interface ProjectProps {
  project: DetailedProject,
  setProject: (project: any) => void,
}

const Project: FC<ProjectProps> = ({ project, setProject }) => {
  return (
    <Fragment>
      <ProjectName project={project} />
      <ProjectMembers project={project} />
      <ProjectTokens project={project} setProject={setProject} />
    </Fragment>
  )
}

export default Project