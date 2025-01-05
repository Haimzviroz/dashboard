export interface SoftwareState {
  software: Software,
  state: DeviceSoftwareStateEnum
  downloadDate?: string,
  deployDate?: string,
  offering?: Software[]
}

export interface Software {
  catalogId: string,
  name: string,
  versionNumber: string,
  virtualSize: number
  latest: boolean,
  uploadDate?: string,
}

export enum DeviceSoftwareStateEnum {
  OFFERING = "offering",
  PUSH = "push",
  DELIVERY = "delivery",
  DEPLOY = "deploy",
  INSTALLED = "installed",
  UNINSTALLED = "uninstalled",
}