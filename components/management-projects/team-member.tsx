import { FC, Fragment, useState } from "react"

import { deleteMember, updateMember } from "@/apis/client-side/project-management-actions.api"

import MemberForm from "./member-from"

import { Project, Member } from '@/types/interfaces';

import s from '../../styles/management-project.module.css';

interface TeamMemberProps {
  member: Member,
  project: Project,
  setProject: (project: any) => void
}

const TeamMember: FC<TeamMemberProps> = ({ member, project, setProject }) => {
  const [doDisplayActions, setDoDisplayActions] = useState<boolean>(false)
  const [doEditMember, setDoEditMember] = useState<boolean>(false)

  const submitUpdatedMember = async (data: any) => {
    data = { ...data, projectId: project.id }
    try {
      const res = await updateMember(project.id, member.id, data)
      const memberIndex = project.members.findIndex((m: any) => m.id === member.id)
      project.members.splice(memberIndex, 1, res)
      const updatedProject = { ...project }
      setProject(updatedProject)
      setDoDisplayActions(!doDisplayActions)
      setDoEditMember(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteMember = async () => {
    const doDeleteMember = confirm(`Are you sure that you want delete ${member.firstName} ${member.lastName} `)
    if (doDeleteMember) {
      const data = { email: member.email }

      try {
        await deleteMember(project.id, member.id, data)
        const memberIndex = project.members.findIndex((m: any) => m.id === member.id)
        project.members.splice(memberIndex, 1)
        const updatedProject = { ...project }
        setProject(updatedProject)
      } catch (error) {

      }
    }
  }

  return (
    <Fragment>
      <div
        onMouseEnter={() => { setDoDisplayActions(true) }}
        onMouseLeave={() => { setDoDisplayActions(false) }}
        className={s["item-wrap"]}
      >
        <div className={`${s.row}`}>
          <div className={s["member-name-wrap"]}>
            <div>{`${member.firstName?? ""} ${member.lastName?? ""} ${(!member.firstName && !member.lastName) ? member.email : ""}`} </div>
          </div>
          {
            doDisplayActions &&
            <div>
              <button className={`${s["edit-button"]} ${s.button}`} onClick={() => { setDoEditMember(!doEditMember) }} >Edit</button>
              <button className={`${s["delete-button"]} ${s.button}`} onClick={() => { handleDeleteMember() }}>Delete</button>
            </div>
          }
        </div>
        {
          doEditMember &&
          <MemberForm submit={submitUpdatedMember} member={member} ></MemberForm>
        }
      </div>
    </Fragment>
  )


}

export default TeamMember