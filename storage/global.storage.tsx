import { Project } from "@/types/interfaces/project.interface"
import { createContext, FC, useEffect, useState } from "react"
import { ProjectProps } from './../types/interfaces/props.interface';
import { useRouter } from 'next/router';
import { NavBarOption } from "@/types/enum";
import { R_PROJECTS } from "@/apis/routes";
import { useGetApp } from "@/hooks";

export const GlobalContext = createContext({} as ProjectProps)

const GlobalProvider: FC<any> = ({ children }: any) => {
	const [projects, setProjects] = useState<Project[]>([])
	const [selectedProject, setSelectedProject] = useState<Project>({} as Project)
	const [activated, setActivated] = useState<NavBarOption | null>(null);

	const { router } = useGetApp()

	useEffect(() => {
		const spn = router.asPath.split("/")
		const active = spn[spn.length - 1]
		const project = spn[spn.length - 2]

		if (selectedProject && activated && ((selectedProject.id && selectedProject?.id.toString() != project) || activated != active)) {
			const href = `${R_PROJECTS}/${selectedProject.id}/${activated}`;
			router.push(href)
		}
	}, [selectedProject, activated])

	const updateProject = (project: Project) => {
		project.id != selectedProject.id && setSelectedProject(project)
		setProjects((projects: Project[]): Project[] => {
			const index = projects.findIndex(p => p.id === project?.id)

			if (index !== -1) {
				projects[index] = project
			} else {
				projects.push(project)
			}
			return [...projects]
		})
	}



	return (
		<GlobalContext.Provider value={{
			projects,
			setProjects,
			selectedProject,
			setSelectedProject,
			updateProject,
			activated,
			setActivated
		}}>
			{children}
		</GlobalContext.Provider>
	)
}

export default GlobalProvider
