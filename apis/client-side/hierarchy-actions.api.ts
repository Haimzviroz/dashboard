import { PlatformsApiFp, DeviceTypesApiFp, DeviceHierarchyApiFp } from '@/api/src';
import { conf } from './token-client.middleware';
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from '@/api/src';

export const getPlatforms = async (params?: string) => {
  const fun = await PlatformsApiFp(await conf()).hierarchyControllerGetPlatforms(params || "");
  return (await fun()).data;
};

export const getDeviceTypes = async (params?: string) => {
  const fun = await DeviceTypesApiFp(await conf()).hierarchyControllerGetDeviceTypes(params || "");
  return (await fun()).data;
};

export const createDeviceType = async (dto: CreateDeviceTypeDto) => {
  const fun = await DeviceTypesApiFp(await conf()).hierarchyControllerCreateDeviceType(dto);
  return (await fun()).data;
};

export const updateDeviceType = async (id: number, dto: UpdateDeviceTypeDto) => {
  const fun = await DeviceTypesApiFp(await conf()).hierarchyControllerUpdateDeviceType(id, dto);
  return (await fun()).data;
};

export const deleteDeviceType = async (id: number) => {
  const fun = await DeviceTypesApiFp(await conf()).hierarchyControllerDeleteDeviceType(id);
  return (await fun()).data;
};

export const createPlatform = async (dto: { name: string; description: string }) => {
  const fun = await PlatformsApiFp(await conf()).hierarchyControllerCreatePlatform(dto);
  return (await fun()).data;
};

export const updatePlatform = async (id: number, dto: { name: string; description: string }) => {
  const fun = await PlatformsApiFp(await conf()).hierarchyControllerUpdatePlatform(id, dto);
  return (await fun()).data;
};

export const deletePlatform = async (id: number) => {
  const fun = await PlatformsApiFp(await conf()).hierarchyControllerDeletePlatform(id);
  return (await fun()).data;
};

export const getPlatformHierarchy = async (platformId: number) => {
  const fun = await DeviceHierarchyApiFp(await conf()).hierarchyControllerGetPlatformHierarchy(platformId);
  return (await fun()).data;
};

export const assignDeviceTypeToPlatform = async (platformId: number, deviceTypeIds: number) => {
  const fun = await DeviceHierarchyApiFp(await conf()).hierarchyControllerAddDeviceTypeToPlatform(platformId, deviceTypeIds);
  return (await fun()).data;
};

export const removeDeviceTypeFromPlatform = async (platformId: number, deviceTypeId: number) => {
  const fun = await DeviceHierarchyApiFp(await conf()).hierarchyControllerRemoveDeviceTypeFromPlatform(platformId, deviceTypeId);
  return (await fun()).data;
};
