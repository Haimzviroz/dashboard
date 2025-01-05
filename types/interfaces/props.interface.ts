import { Dispatch, SetStateAction } from "react";
import { NavBarOption } from "../enum";
import { Project } from "./project.interface";

export interface ProjectProps{
  projects: Project[];
  selectedProject: Project;
  setProjects: Dispatch<SetStateAction<Project[]>>;
  setSelectedProject: Dispatch<SetStateAction<Project>>;
  updateProject: (project:Project) =>  void;
  activated : NavBarOption | null
  setActivated: Dispatch<SetStateAction<NavBarOption | null>>;
}