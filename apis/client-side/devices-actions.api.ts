import { Device, Group, GroupRes, PushOfferDto } from '@/types/interfaces/devices';
import { DEVICES, SOFTWARE_META_DATA, DEVICES_PUT, DEVICE_INFO, DEVICE_MAPS, DEVICE_SOFTWARES, GROUP, OFFERED_SOFTWARE, OFFERING_PUSH, MAPS_META_DATA } from '../paths';
import { clientRequestWithAuth } from './token-client.middleware';
import { Software } from '@/types/interfaces/getapp';
import Logger from '@/services/logger';

const logger = Logger(__filename)

// Devices
export const getDevices = async (stringParams?: string | null) => {
  const urlWithParams = stringParams ? `${DEVICES}?${stringParams}` : DEVICES
  let devices: Device[] = await clientRequestWithAuth(urlWithParams, "get");
  devices = devices.filter(device => device != null)
  return devices
}

export const getDeviceInfo = async (id: string) => {
  return await clientRequestWithAuth(DEVICE_INFO + id, "get")
}

export const getSoftwareMetaData = async (stringParams?: string | null) => {
  const urlWithParams = stringParams ? `${SOFTWARE_META_DATA}?${stringParams}` : SOFTWARE_META_DATA
  return await clientRequestWithAuth(urlWithParams, "get")
}

export const getMapMetaData = async (stringParams?: string | null) => {
  const urlWithParams = stringParams ? `${MAPS_META_DATA}?${stringParams}` : MAPS_META_DATA
  return await clientRequestWithAuth(urlWithParams, "get")
}

export const putDeviceName = async (deviceId: string, name: string) => {
  return await clientRequestWithAuth(DEVICES_PUT(deviceId), "put", { name })
}


// Device with
export const getDeviceWithMap = async (id: string) => {
  return await clientRequestWithAuth(DEVICE_MAPS(id), "get")
}

export const getDeviceWithSoftware = async (id: string) => {
  return await clientRequestWithAuth(DEVICE_SOFTWARES(id), "get")
}


// Groups
export const getGroups = async () => {
  let groups: GroupRes = await clientRequestWithAuth(GROUP, "get");
  return groups
}

export const getGroup = async (id: number) => {
  let group: Group = await clientRequestWithAuth(GROUP + "/" + id, "get");
  return group
}

// Offerings
export const pushOffer = async (data: PushOfferDto) => {
  return await clientRequestWithAuth(OFFERING_PUSH, "post", data);
}

export const getOffering = async (catalogId: string): Promise<Software> => {
  return await clientRequestWithAuth(OFFERED_SOFTWARE(catalogId), "get",);
}
