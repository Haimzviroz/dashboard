export * from "./gm-storage.interface";
export * from "./gm-api.interfaces";
export * from "./gm-map-draw.interface";

import { LatLngTuple } from "leaflet";
import { Device } from "../devices";
import { MapImportStatusEnum } from "@/types/enum/getmap";


export interface Maps {
  selected?: boolean;
  isCollapsed?: boolean;
  catalogId: string;
  name: string;
  createDate: string;
  exportEndDate?: string;
  boundingBox: string;
  footprint?: string;
  coords?: LatLngTuple[][] | LatLngTuple[][][];
  fileName?: string;
  packageUrl?: string;
  size: number;
  isUpdate: boolean;
  status: MapImportStatusEnum;
  product: productMap
  devices?: Device[];
}

export type StrPointsType = "bbox" | "polygon" | "invalid"

export interface Map extends Maps {
  devices: Device[];
}

export interface MapState {
  map: Maps;
  state: DeviceMapStateEnum
}

export enum DeviceMapStateEnum {
  OFFERING = "offering",
  PUSH = "push",
  IMPORT = "import",
  DELIVERY = "delivery",
  INSTALLED = "installed",
  UNINSTALLED = "uninstalled"
}

// export interface Device {
//   selected?: boolean;
//   id: string;
//   lastUpdatedDate: Date;
//   OS: string;
//   availableStorage: string;
//   power: number;
//   bandwidth: number;
//   operativeState: boolean;
// }

export interface ProductsRes {
  status: "Success" | "Error";
  products: productMap[] ;
  // products: productMap[] | { [key: string]: productMap };
  reason: string | null
}

export interface productMap {
  id: string;
  productId: string;
  productName: string;
  productVersion: string;
  productType: string;
  productSubType: string | null;
  description: string | null;
  imagingTimeBeginUTC: string;
  imagingTimeEndUTC: string;
  maxResolutionDeg: number;
  footprint: string;
  transparency: string;
  region: string;
  ingestionDate: string;
}

