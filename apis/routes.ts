export const R_GET_APP = "/getapp";
export const R_GET_MAP = "/getmap";

// devices
export const R_DEVICES = "/devices";

// groups
export const R_GROUPS = "/groups";
export const R_GROUPS_MANAGE = R_GROUPS + "/management";

// get app
export const R_APP_DEVICES = R_GET_APP + R_DEVICES;
export const R_APP_GROUP = R_GET_APP + R_GROUPS_MANAGE;
export const R_PROJECTS = R_GET_APP + "/projects";
export const R_PROJECTS_NEW = R_PROJECTS + "/new";
export const R_FORMATIONS = R_GET_APP + "/formations";
export const R_FORMATIONS_NEW = R_FORMATIONS + "/new";
// get map
export const R_MAP_DEVICES = R_GET_MAP + R_DEVICES;
export const R_MAP_GROUP = R_GET_MAP + R_GROUPS_MANAGE;
export const R_MAPS = R_GET_MAP + "/maps";