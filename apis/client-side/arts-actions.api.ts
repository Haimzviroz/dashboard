import { conf } from './token-client.middleware';
import {
  ReleasesApiAxiosParamCreator,
  ReleasesApiFp,
  SetReleaseArtifactDto,
  SetReleaseArtifactResDto
} from '@/api/src';

export const uploadRelArt = async (projectName: string, version: string, data: SetReleaseArtifactDto): Promise<SetReleaseArtifactResDto> => {
  const res = await ReleasesApiFp(await conf()).releasesControllerSetReleaseArtifact(projectName, version, data)
  return (await res()).data
}

export const removeRelArt = async (projectName: string, version: string, artifactId: number): Promise<void> => {
  const res = await ReleasesApiFp(await conf()).releasesControllerDeleteReleaseArtifact(projectName, version, artifactId)
  return (await res()).data
}

export const downloadArt = async (projectName: string, version: string, fileName: string) => {
  const res = await ReleasesApiAxiosParamCreator(await conf()).releasesControllerDownloadArtifact(projectName, version, fileName)
  return res
}
