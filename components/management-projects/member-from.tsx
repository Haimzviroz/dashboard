import { FC, Fragment, useEffect, useState } from "react"

import s from '../../styles/management-project.module.css';
import { getUsers } from "@/apis/client-side/projects-actions.api";


interface MemberFormProps {
  member?: any,
  submit: (data: any) => void
}

const MemberForm: FC<MemberFormProps> = ({ submit, member }) => {
  const [memberInEdit, setMemberInEdit] = useState<any>(member ? member : null)
  const [users, setUsers] = useState([])
  const [isUsersOpen, setISUsersOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>()


  useEffect(()=>{
    if(selectedUser){
      setMemberInEdit(selectedUser)
      setISUsersOpen(false)
    }
  },[selectedUser])

  const getAllUsers = async (params: { [key: string]: string }) => {
    try {
      return await getUsers(params)
    } catch (error) {
      console.log(`Err getting all users: ${error}`);

    }
  }

  const onInputValue = async (label: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedMember = { ...memberInEdit, [label]: e.target.value }
    if(e.target.value.length > 1) {
      const foundUser = await getAllUsers({ [label]: e.target.value })
      setSelectedUser(undefined)
      setISUsersOpen(true)
      setUsers(foundUser)
    }
    setMemberInEdit(updatedMember)
  }

  return (
    <form className={`${s.form}`}>
      <div className={`${s["form-section"]}`}>
        <div>
          <label htmlFor="first-name">{`first name`} </label>
          <input id="first-name" type={"text"} value={memberInEdit?.firstName ? memberInEdit.firstName : ""} onChange={(e) => onInputValue("firstName", e)} />
        </div>
        <div>
          <label htmlFor="last-name">{`last name `} </label>
          <input id="last-name" type={"text"} value={memberInEdit?.lastName ? memberInEdit.lastName : ""} onChange={(e) => onInputValue("lastName", e)} />
        </div>
      </div>
      <div className={`${s["form-section"]}`}>
        <div>
          <label htmlFor="email">{`Email `}</label>
          <input id="email" type={"text"} value={memberInEdit?.email ? memberInEdit.email : ""} onChange={(e) => onInputValue("email", e)} />
        </div>
        <div>
          <label htmlFor="role">{`role `}</label>
          <select className={`${s["role-select"]}`} defaultValue={"project-member"} id="role" value={member ? memberInEdit.role : ""} onChange={(e) => onInputValue("role", e)}>
            <option>project-admin</option>
            <option>project-member</option>
          </select>
        </div>

      </div>
      <div className={`${s["form-section"]} ${s["form-button"]} `}>
        <button className={`${s.button} ${s["submit-button"]}`} onClick={(e) => { e.preventDefault(); submit(memberInEdit) }}>{member ? "update" : "create"}</button>
      </div>
      <div style={{ position: "absolute" }}>

        <div className={`${s["wrap-user-row"]}`}>
          {isUsersOpen && users && users.map((u: any) => <div key={u.email} className={`${s["user-row"]}`} onClick={() => setSelectedUser(u)}>
            <div style={{ fontWeight: "bold", paddingBottom: "4px" }}>{u.email}</div>
            <div>{u.firstName} {u.lastName}</div>
          </div>)}
        </div>
      </div>

    </form>
  )
}

export default MemberForm