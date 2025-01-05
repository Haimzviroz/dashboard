import { FC, Fragment, useState } from "react"

import Token from "./token";

import { Project } from '@/types/interfaces';

import s from '../../styles/management-project.module.css';

import { addToken } from "@/apis/client-side/project-management-actions.api";
import Popup from "@/ui/popup";

interface ProjectTokensProps {
  project: Project;
  setProject: (project: Project) => void;
}

const ProjectTokens: FC<ProjectTokensProps> = ({ project, setProject }) => {
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);
  const createToken = async () => {
    try {
      const newToken = (await addToken(project.id)).projectToken
      setProject(setToken(newToken))
    } catch (error) {
      console.error(error)
    }
  }

  const setToken = (token: string) => {
    const updatedProject = project
    if (!updatedProject.addedTokens) {
      updatedProject.addedTokens = []
    }
    updatedProject.addedTokens.push(token)
    return updatedProject
  }

  return (
    <Fragment>
      <div className={s["section-wrap"]}>
        <div className={s["section-header"]}>Tokens
          <span
            className={s["plus-icon"]}
            onClick={() => createToken()}
            onMouseEnter={() => setIsPopupShown(true)}
            onMouseLeave={() => setIsPopupShown(false)}
          > + </span>
          {isPopupShown && <Popup body="Add a new Token" style={{ bottom: "55px", left: "30px" }} />}
        </div>
        {project.tokens && <Token token={project.tokens[0]}></Token>}
        {project.addedTokens?.map((token: any, i: number) => {
          return <Token key={i} token={token}></Token>
        })}
      </div>
    </Fragment>
  )
}
export default ProjectTokens