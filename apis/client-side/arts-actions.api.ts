import { conf } from './token-client.middleware';
import {
  CatalogUploadApiAxiosParamCreator,
  CatalogUploadApiFp,
  SetReleaseArtifactDto,
  SetReleaseArtifactResDto
} from '@/api/src';

export const uploadRelArt = async (projectName: string, version: string, data: SetReleaseArtifactDto): Promise<SetReleaseArtifactResDto> => {
  const res = await CatalogUploadApiFp(await conf()).releasesControllerSetReleaseArtifact(projectName, version, data)
  return (await res()).data
}

export const removeRelArt = async (projectName: string, version: string, artifactId: number): Promise<void> => {
  const res = await CatalogUploadApiFp(await conf()).releasesControllerDeleteReleaseArtifact(projectName, version, artifactId)
  return (await res()).data
}

export const downloadArt = async (projectName: string, version: string, fileName: string) => {
  const res = await CatalogUploadApiAxiosParamCreator(await conf()).releasesControllerDownloadArtifact(projectName, version, fileName)
  return res
}
