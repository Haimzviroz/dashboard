import { conf } from './token-client.middleware';
import {
  RegulationStatusDto,
  CatalogUploadApiFp,
  SetRegulationStatusDto
} from '@/api/src';

export const getRegulationsStatus = async (projectId: string, version: string): Promise<RegulationStatusDto[]> => {
  const fun = await CatalogUploadApiFp(await conf()).releasesControllerGetVersionRegulationStatuses(projectId, version)
  return (await fun()).data
}

export const setRegulationsStatus = async (projectId: string, version: string, regulation: string, data: SetRegulationStatusDto): Promise<RegulationStatusDto> => {
  const fun = await CatalogUploadApiFp(await conf()).releasesControllerSetRegulationStatus(projectId, version, regulation, data)
  return (await fun()).data
}
