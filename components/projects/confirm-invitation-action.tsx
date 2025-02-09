import { Dispatch, FC, Fragment, SetStateAction, useState } from "react"


import { Project } from '@/types/interfaces';
import { ProNavBarOption } from "@/types/enum";

import s from '../../styles/management-project.module.css';

import { confirmProjectInvitation } from "@/apis/client-side/projects-actions.api";

interface ProjectInvitationProps {
  setProject: (project: Project) => void,
  setActivated: Dispatch<SetStateAction<ProNavBarOption | null>>;
  invitedProjects: Project[]
}

const ProjectInvitationHandler: FC<ProjectInvitationProps> = ({ setProject, setActivated, invitedProjects }) => {
  const [doAddProject, setDoAddProject] = useState(false)

  const createProjectHandler = () => {
    setDoAddProject(!doAddProject)
  }

  const AcceptInvitation = async (data: any) => {
    try {
      const res = await confirmProjectInvitation(data)
      setProject(res)
      setActivated(ProNavBarOption.ACTIVITY)
      createProjectHandler()
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <Fragment>
      <div
        className={s["item-wrap"]}
        onClick={() => createProjectHandler()
        }>
        <div className={`${s.row}`}>
          <div>
            Confirm your invitations
          </div>
        </div>
      </div>
      {doAddProject &&
        <div className={s.form} style={{ display: "block" }}>
          <div style={{marginBottom: "10px"}} >You are invited to the following projects:</div>
          <ul className={s["invite-row"]}>
            {invitedProjects.map((project) => (
              <li key={project.id} style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{project.name} - {project.description}</div>
                  <div>
                    <button className={`${s["edit-button"]} ${s.button}`} onClick={() => { AcceptInvitation(project.id) }} >Accept</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>}
    </Fragment>
  )
}

export default ProjectInvitationHandler