import { Dispatch, SetStateAction } from "react";
import { ProNavBarOption } from "../enum";
import { Project } from "./project.interface";

export interface ProjectProps{
  projects: Project[];
  selectedProject: Project;
  setProjects: Dispatch<SetStateAction<Project[]>>;
  setSelectedProject: Dispatch<SetStateAction<Project>>;
  updateProject: (project:Project) =>  void;
  activated : ProNavBarOption | null
  setActivated: Dispatch<SetStateAction<ProNavBarOption | null>>;
}