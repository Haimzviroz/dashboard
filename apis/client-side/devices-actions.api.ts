import { Group, GroupRes } from '@/types/interfaces/devices';
import { DEVICES_PUT, DEVICE_INFO, DEVICE_MAPS, GROUP, OFFERED_SOFTWARE } from '../paths';
import { clientRequestWithAuth, conf } from './token-client.middleware';
import { Software } from '@/types/interfaces/getapp';
import Logger from '@/services/logger';
import { DeviceApiFp, CatalogOfferingApiFp, PushOfferingDto, OrganizationGroupsApiFp } from '@/api/src';

const logger = Logger(__filename)

// Devices
export const getDevices = async (groups?: string | string[]) => {
  groups && (groups = Array.isArray(groups) ? groups : [groups])
  const fun = await DeviceApiFp(await conf()).deviceControllerGetRegisteredDevices(groups as string[])
  let devices = (await fun()).data
  devices = devices.filter(device => device != null)
  return devices
}

export const getDeviceInfo = async (id: string) => {
  return await clientRequestWithAuth(DEVICE_INFO + id, "get")
}

export const getSoftwareMetaData = async (groups?: string | string[], software?: string | string[]) => {
  groups && (groups = Array.isArray(groups) ? groups : [groups])
  software && (software = Array.isArray(software) ? software : [software])
  const fun = await DeviceApiFp(await conf()).deviceControllerGetDevicesSoftwareStatisticInfo(groups as string[], software as string[]);
  return (await fun()).data
}

export const getMapMetaData = async (groups?: string | string[], map?: string | string[]) => {
  groups && (groups = Array.isArray(groups) ? groups : [groups])
  map && (map = Array.isArray(map) ? map : [map])
  const fun = await DeviceApiFp(await conf()).deviceControllerGetDevicesMapStatisticInfo(groups as string[], map as string[]);
  return (await fun()).data
}

export const putDeviceName = async (deviceId: string, name: string) => {
  return await clientRequestWithAuth(DEVICES_PUT(deviceId), "put", { name })
}


// Device with
export const getDeviceWithMap = async (id: string) => {
  return await clientRequestWithAuth(DEVICE_MAPS(id), "get")
}

export const getDeviceWithSoftware = async (id: string) => {
  const fun = await DeviceApiFp(await conf()).deviceControllerGetDeviceSoftwares(id)
  return (await fun()).data
}


// Groups
export const getGroups = async () => {
  const fun = await OrganizationGroupsApiFp(await conf()).groupControllerGetGroups();
  return (await fun()).data
}

export const getGroup = async (id: number) => {
  const fun = await OrganizationGroupsApiFp(await conf()).groupControllerGetGroupById(id.toString());
  return (await fun()).data
}

// Offerings
export const pushOffer = async (data: PushOfferingDto) => {
  const fun = await CatalogOfferingApiFp(await conf()).offeringControllerPushOffering(data)
  return (await fun()).data
}

export const getOffering = async (catalogId: string): Promise<Software> => {
  return await clientRequestWithAuth(OFFERED_SOFTWARE(catalogId), "get",);
}
