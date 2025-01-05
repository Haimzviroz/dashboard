import { SoftwareState } from "../getapp";
import { MapState, Maps } from "../getmap";

export * from "./devices-storage.interface";
export * from "./group.interface"


export interface Device {
  selected?: boolean;
  id: string;
  name: string
  lastUpdatedDate: string;
  lastConnectionDate: string;
  OS: string;
  availableStorage: string;
  power: number;
  bandwidth: number;
  operativeState: boolean;
  groupName?: string,
  groupId?: number,
  uid?: number
}

export interface DeviceMaps extends Device {
  maps: MapState[]
}

export interface DeviceSoftWare extends Device {
  softwares: SoftwareState[]
}

export interface DeviceInfo {
  maps: Maps[];
  components: any;
}

export interface MetaData {
  sum: number,
  devices: string[]
}

export interface DeviceMetaData {
  count: MetaData,
  updated: MetaData
  onUpdateProcess: MetaData
  updateError: MetaData
}

export interface PushOfferDto{
  catalogId: string,
  devices?: string[],
  groups?: number[],
  itemType: ItemTypeEnum
}

export enum ItemTypeEnum {
  SOFTWARE = 'software',
  MAP = 'map',
  CACHE = 'cache'
}