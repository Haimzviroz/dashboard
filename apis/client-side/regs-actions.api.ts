import { conf } from './token-client.middleware';
import {
  ReleasesApiFp
} from '@/api/src';

export const getRegulationsStatus = async (projectId: string, version: string) => {
  const fun = await ReleasesApiFp(await conf()).releasesControllerGetVersionRegulationStatuses(projectId, version)
  return (await fun()).data
}
