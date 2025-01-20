import { NavBarOption } from "@/types/enum";

export const R_GET_APP = "/getapp";
export const R_GET_MAP = "/getmap";
export const R_DEVICES = "/devices";

// get app
export const R_APP_DEVICES = R_GET_APP + R_DEVICES;
export const R_PROJECTS = R_GET_APP + "/projects";
export const R_PROJECTS_OVERVIEW = (projectName: string) => R_PROJECTS + `/${projectName}/${NavBarOption.OVERVIEW}`;
export const R_PROJECTS_NEW = R_PROJECTS + "/new";

// get map
export const R_MAP_DEVICES = R_GET_MAP + R_DEVICES;
export const R_MAPS = R_GET_MAP + "/maps";