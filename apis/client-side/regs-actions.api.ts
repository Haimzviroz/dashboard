import { conf } from './token-client.middleware';
import {
  RegulationStatusDto,
  ReleasesApiFp,
  SetRegulationStatusDto
} from '@/api/src';

export const getRegulationsStatus = async (projectId: string, version: string): Promise<RegulationStatusDto[]> => {
  const fun = await ReleasesApiFp(await conf()).releasesControllerGetVersionRegulationStatuses(projectId, version)
  return (await fun()).data
}

export const setRegulationsStatus = async (projectId: string, version: string, regulation: string, data: SetRegulationStatusDto): Promise<RegulationStatusDto> => {
  const fun = await ReleasesApiFp(await conf()).releasesControllerSetRegulationStatus(projectId, version, regulation, data)
  return (await fun()).data
}
