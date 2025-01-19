import getConfig from "next/config";

export const BASE_PATHS = getConfig().publicRuntimeConfig.BASE_URL
export const LOGIN = "login/"
export const REFRESH = "refresh/"


const PROJECT_MANAGEMENT = "project/"
export const USERS = "users/";
export const PROJECT = PROJECT_MANAGEMENT;
export const SEARCH_PROJECT = PROJECT + "search";
export const MEMBER = "member/";
export const CONFIRM = "confirm/";

export const CREATE_TOKEN = "createToken/"

export const PROJECT_RELEASES = "/projectReleases"
export const CONFIG_OPTION = PROJECT_MANAGEMENT + "projectConfigOption"


export const DEVICES = "device/devices"
export const SOFTWARE_META_DATA = DEVICES + "/software/info"
export const MAPS_META_DATA = DEVICES + "/map/info"
export const DEVICES_PUT = (deviceId: string) => `device/${deviceId}`
export const DEVICE_INFO = "device/info/installed/"
export const DEVICE_MAPS = (deviceId: string) => `device/${deviceId}/maps`
export const DEVICE_SOFTWARES = (deviceId: string) => `device/${deviceId}/softwares`

export const GROUP = "group"

// Offering
export const OFFERING = "offering"
export const OFFERING_PUSH = OFFERING + "/push"
export const OFFERED_SOFTWARE = (catalogId: string) => OFFERING + "/component/" + catalogId

// Get map routes
export const MAPS = "map/maps"
export const MAP = "map/map"
export const MAP_PUT = (catalogId: string) => `map/${catalogId}`
export const MAPS_OFFERING = "map/offering"
export const IMPORT_CREATE = "map/import/create"


