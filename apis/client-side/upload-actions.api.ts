import { conf } from './token-client.middleware';
import {
  ReleasesApiFp,
  SetReleaseArtifactDto,
  SetReleaseArtifactResDto
} from '@/api/src';

export const uploadRelArt = async (projectName: string, version: string, data: SetReleaseArtifactDto): Promise<SetReleaseArtifactResDto> => {
  const res = await ReleasesApiFp(await conf()).releasesControllerSetReleaseArtifact(projectName, version, data)
  return (await res()).data
}

export const RemoveRelArt = async (projectName: string, version: string, artifactId: number): Promise<void> => {
  const res = await ReleasesApiFp(await conf()).releasesControllerDeleteReleaseArtifact(projectName, version, artifactId)
  return (await res()).data
}
