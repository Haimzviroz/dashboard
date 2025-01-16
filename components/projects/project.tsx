import { FC, Fragment } from "react"

import ProjectName from '@/components/header/project-name';
import ProjectMembers from "./members/project-members";
import ProjectTokens from "./project-tokens";

import { Project as Proj } from '@/types/interfaces';

import s from '../../styles/management-project.module.css';

interface ProjectProps {
  project: Proj,
  setProject: (project: any) => void,
}

const Project: FC<ProjectProps> = ({ project, setProject }) => {
  return (
    <Fragment>
      <ProjectName project={project} />
      <ProjectMembers project={project} setProject={setProject} />
      <ProjectTokens project={project} setProject={setProject} />
    </Fragment>
  )
}

export default Project