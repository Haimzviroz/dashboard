import { FC, Fragment, useState } from "react"
import { Project } from '@/types/interfaces';
import TeamMember from "./team-member";
import s from '../../styles/management-project.module.css';
import Popup from "@/ui/popup";
import { addNewMember } from "@/apis/client-side/project-management-actions.api";
import MemberForm from "./member-from";


interface ProjectMembersProps {
  project: Project;
  setProject: (project: Project) => void
}

const ProjectMembers: FC<ProjectMembersProps> = ({ project, setProject }) => {
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);
  const [doAddMember, setDoAddMember] = useState<boolean>(false);

  const actionHandler = (action: (state: boolean) => void, actionState: boolean) => {
    action(!actionState)
  }

  const submitNewMember = async (data: any) => {
    try {
      const res = await addNewMember(project.id, data)
      setMember(res.member)
      actionHandler(setDoAddMember, doAddMember)
    } catch (error) {
      console.error(error)
    }
  }

  const setMember = (member: any) => {
    project.members = [...project.members, member]
    const updateProject = { ...project }
    setProject(updateProject)
  }


  return (
    <div className={s["section-wrap"]}>
      <div className={s["section-header"]}>Team
        <span
          className={s["plus-icon"]}
          onClick={() => actionHandler(setDoAddMember, doAddMember)}
          onMouseEnter={() => setIsPopupShown(true)}
          onMouseLeave={() => setIsPopupShown(false)}
        > + </span>
        {isPopupShown && <Popup body="Add a new member" style={{ bottom: "55px", left: "30px" }} />}
      </div>
      {doAddMember && <MemberForm submit={submitNewMember} ></MemberForm>}
      {project.members.map((member: any, i: number) => {
        return <TeamMember key={member.id} member={member} project={project} setProject={setProject}></TeamMember>
      })}
    </div>
  )
}

export default ProjectMembers