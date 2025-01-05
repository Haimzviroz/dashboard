import { FC, Fragment } from "react"
import { Project } from '@/types/interfaces/project.interface';
import s from '../../styles/header.module.css'


interface ProjectNameProps {
  project : Project
}

const ProjectName :FC<ProjectNameProps> = ({project}) => {
  return (
    <Fragment>
      <div className={s["project-name"]}>{project.name}</div>
      <div className={s["project-description"]}>{project.description}</div>
    </Fragment>
  )
}

export default ProjectName