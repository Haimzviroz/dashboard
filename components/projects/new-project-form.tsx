import { FC, Fragment, useEffect, useState } from "react"

import s from '../../styles/management-project.module.css';
import { getProjectConfigOption } from "@/apis/client-side/projects-actions.api";
import { ProjectConfig } from "@/types/interfaces";


interface NewProjectFormProps {
  submit: (data: any) => void,
}

const NewProjectForm: FC<NewProjectFormProps> = ({ submit }) => {
  const [projectName, setProjectName] = useState<string>("")
  const [projectDescription, setProjectDescription] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])
  const [formations, setFormations] = useState<string[]>([])
  const [operationsSystem, setOperationsSystem] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])

  useEffect(() => {
    getProjectOption();
  }, [])

  const getProjectOption = async () => {
    const projectDetailsOption: ProjectConfig = await getProjectConfigOption()

    for (const key in projectDetailsOption) {
      switch (key) {
        case "categories":
          setCategories(projectDetailsOption.categories)
          break;
        case "formations":
          setPlatforms(projectDetailsOption.platforms)
          break;
        case "operationsSystem":
          setOperationsSystem(projectDetailsOption.operationsSystem)
          break;
        case "platforms":
          setPlatforms(projectDetailsOption.platforms)
          break;
        default:
          break;
      }
    }

  }

  const onInputValue = (label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    switch (label) {
      case "projectName":
        setProjectName(e.target.value)
        break;
      case "projectDescription":
        setProjectDescription(e.target.value)
        break;
      default:
        break;
    }
  }

  // const onInputValue = (label: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const updatedMember = { ...memberInEdit, [label]: e.target.value }
  //   setMemberInEdit(updatedMember)
  // }

  const getDataToSubmit = () => {
    return {
      name: projectName,
      description: projectDescription,
      OS: "windows",
      platformType: "Merkava",
      formation: "yatush",
      artifactType: "harbor",
      category: 'tank'
    }
  }

  return (
    <div className={`${s.form}`}>
      <div className={`${s["form-section"]}`} >
        <div>
          <label htmlFor="name">Name
          </label>
          <input id="name" type={"text"} onChange={(e) => onInputValue("projectName", e)} />
        </div>

        <div>
          <label htmlFor="description">Description</label >
          <input id="description" type={"text"} onChange={(e) => onInputValue("projectDescription", e)} />
        </div>
        <div>
          <label htmlFor="Os">OS</label>
          <select className={`${s["role-select"]}`} value={""} id="OS" onChange={(e) => ""}>
            {operationsSystem.map((os, i) => <option key={i}>{os}</option>)}
          </select>
        </div>
      </div>
      <div className={`${s["form-section"]} ${s["form-button"]} `}>
        <button className={`${s.button} ${s["submit-button"]}`} onClick={() => { submit(getDataToSubmit()) }}>Create</button>
      </div>
    </div>
  )
}

export default NewProjectForm


