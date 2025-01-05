import { FC, Fragment, useState } from "react"

import s from '../../styles/management-project.module.css';


interface MemberFormProps {
  member?: any,
  submit: (data: any) => void
}

const MemberForm: FC<MemberFormProps> = ({ submit, member }) => {
  const [memberInEdit, setMemberInEdit] = useState<any>(member ? member : null)

  const onInputValue = (label: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedMember = { ...memberInEdit, [label]: e.target.value }
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
        <button className={`${s.button} ${s["submit-button"]}` } onClick={(e) => { e.preventDefault(); submit(memberInEdit) }}>{member ? "update" : "create"}</button>
      </div>
    </form>
  )
}

export default MemberForm