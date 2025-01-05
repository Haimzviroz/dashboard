import { Dispatch, FC, Fragment, SetStateAction, useState } from "react"

import NewProjectForm from "./new-project-form";

import { Project } from '@/types/interfaces';
import { NavBarOption } from "@/types/enum";

import s from '../../styles/management-project.module.css';

import { addNewProject } from "@/apis/client-side/project-management-actions.api";

interface CreateProjectActionProps {
  setProject: (project: Project) => void,
  setActivated: Dispatch<SetStateAction<NavBarOption | null>>;
}

const CreateProjectAction: FC<CreateProjectActionProps> = ({ setProject, setActivated }) => {
  const [doDisplayActions, setDoDisplayActions] = useState<boolean>(false)
  const [doAddProject, setDoAddProject] = useState(false)

  const createProjectHandler = () => {
    setDoAddProject(!doAddProject)
  }

  const SubmitMewProject = async (data: any) => {
    try {
      const res = await addNewProject(data)
      setProject(res)
      setActivated(NavBarOption.ACTIVITY)
      createProjectHandler()
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <Fragment>
        <div
          className={s["item-wrap"]}
          onMouseEnter={() => { setDoDisplayActions(true) }}
          onMouseLeave={() => { setDoDisplayActions(false) }}
          onClick={() => createProjectHandler()
          }>
          <div className={`${s.row}`}>
            <div>
              Create project
            </div>
            <div className={s["member-name-wrap"]}>

            </div>
            {
              doDisplayActions &&
              <div>
                <button className={`${s["edit-button"]} ${s.button}`} onClick={() => { setDoAddProject(!doAddProject) }} >Add</button>
              </div>
            }
          </div>
        </div>
        {doAddProject && <NewProjectForm
          submit={SubmitMewProject}
        ></NewProjectForm>}
    </Fragment>
  )
}

export default CreateProjectAction