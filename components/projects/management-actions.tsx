import { Dispatch, FC, Fragment, SetStateAction } from "react"


import { Project } from '@/types/interfaces';
import { NavBarOption } from "@/types/enum";

import s from '../../styles/management-project.module.css';

import CreateProjectAction from "./create-project-actions";
import ProjectInvitationHandler from "./confirm-invitation-action";

interface ManagementActionsProps {
  setProject: (project: Project) => void,
  setActivated: Dispatch<SetStateAction<NavBarOption | null>>;
  invitedProjects: Project[]
}

const ManagementActions: FC<ManagementActionsProps> = ({ setProject, setActivated, invitedProjects }) => {

  return (
    <Fragment>
      <div className={s["section-wrap"]}>
        <div className={s["section-header"]}>General</div>
        {invitedProjects.length > 0 && <ProjectInvitationHandler setProject={setProject} setActivated={setActivated} invitedProjects={invitedProjects} />}
        <CreateProjectAction setProject={setProject} setActivated={setActivated} />
      </div>
    </Fragment>
  )
}

export default ManagementActions