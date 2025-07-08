import { OrganizationGroupsApiFp, OrgIdPutDto } from '@/api/src';
import { conf } from './token-client.middleware';

// Fetch all org IDs (optionally filter for empty devices if supported by backend)
export const getOrgIds = async (params?: { group?: number, emptyGroup?: boolean, emptyDevice?: boolean,}) => {
  const fun = await OrganizationGroupsApiFp(await conf()).groupControllerGetOrgIds(
    params?.group,
    params?.emptyGroup,
    params?.emptyDevice
  );
  return (await fun()).data;
};

// Create a new org ID
export const createOrgId = async (orgId: number) => {
  const fun = await OrganizationGroupsApiFp(await conf()).groupControllerCreateOrgIds({ orgId });
  return (await fun()).data;
};

// Edit org ID for a device
export const editOrgId = async (orgId: number, data: OrgIdPutDto) => {
  const fun = await OrganizationGroupsApiFp(await conf()).groupControllerEditOrgIds(orgId, data);
  return (await fun()).data;
};
