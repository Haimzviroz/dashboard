import { ChangeEvent, useContext, useState } from "react"
import { useRouter } from 'next/router';

import { GlobalContext } from './../../storage/global.storage';

import { Project } from "@/types/interfaces";
import { NavBarOption } from "@/types/enum";

import s from '../../styles/header.module.css'

const NavBar = () => {
  const { projects, selectedProject, setSelectedProject, activated, setActivated } = useContext(GlobalContext)

  const router = useRouter()

  const selectOptionHandler = (option: NavBarOption) => {
    if (Object.keys(selectedProject).length) {
      setActivated(option)
    }

    // const href = `/management-projects/${selectedProject.id}/${option}`;
    // router.push(href)
  }

  const selectProject = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value)
    const selectedProject = projects.find((p: Project) => p.id == selectedId)
    if (selectedProject) {
      setSelectedProject(selectedProject)
    }
  }

  return (
    <div className={`${s["nav-bar"]}`}>
      <ul className={`${s.nav}`}>
        <li

          className={`${activated === NavBarOption.ACTIVITY && s.active}`}
          onClick={() => { selectOptionHandler(NavBarOption.ACTIVITY) }}
        >
          {NavBarOption.ACTIVITY}
        </li>
        <li
          className={`${activated === NavBarOption.RELEASES && s.active}`}
          onClick={() => { selectOptionHandler(NavBarOption.RELEASES) }}
        >
          {NavBarOption.RELEASES}
        </li>
        <li
          className={`${activated === NavBarOption.POLICY && s.active}`}
        // onClick={() => { selectOptionHandler(NavBarOption.POLICY) }}
        >{NavBarOption.POLICY}</li>
        <li
          className={`${activated === NavBarOption.DOCS && s.active}`}
        // onClick={() => { selectOptionHandler(NavBarOption.DOCS) }}
        >{NavBarOption.DOCS}</li>
      </ul>
      {projects.length > 0 &&
        <div className={s['select-project-wrapper']}>
          {/* {!selectedProject && <label htmlFor="project-selector">choose a project</label>} */}
          <select id='project-selector' onChange={(e) => { selectProject(e) }}>
            <option hidden selected>select a project</option>
            {projects?.map((project, i) => {
              return <option key={i} value={project.id} selected={project.id === selectedProject?.id}> {project.name}</option>
            })}
          </select>
        </div>}
    </div>
  )
}

export default NavBar