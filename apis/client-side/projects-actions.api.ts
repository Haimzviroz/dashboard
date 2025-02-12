import { PROJECT, CONFIG_OPTION, CONFIRM } from '../paths';
import { clientRequestWithAuth, conf } from './token-client.middleware';
import {
  AddMemberToProjectDto,
  BaseProjectDto,
  CreateDocDto,
  CreateProjectDto,
  CreateProjectTokenDto,
  CreateRegulationDto,
  DetailedProjectDto,
  DetailedReleaseDto,
  EditProjectDto,
  EditProjectMemberDto,
  MemberResDto,
  ProjectApiFp,
  ProjectDto,
  ProjectMemberPreferencesDto,
  ProjectTokenDto,
  ReleaseDto,
  ReleasesApiFp,
  SetReleaseDto,
  UpdateDocDto,
  UpdateOneOfManyRegulationDto,
  UpdateProjectTokenDto,
  UpdateRegulationDto,
  UsersApiFactory,
  UserSearchDto
} from '@/api/src';

export const getUsers = async (params: UserSearchDto): Promise<MemberResDto[]> => {
  const res = await UsersApiFactory(await conf()).usersControllerGetAllUsers(params)
  return res.data
}

export const getPlats = async (params: string): Promise<string[]> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetPlatforms(params)
  return (await fun()).data
}

export const getProjects = async (): Promise<ProjectDto[]> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetProjects()
  return (await fun()).data.data
}

export const searchProjects = async (name: string): Promise<BaseProjectDto[]> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerSearchProjects(name)
  return (await fun()).data.data
}

export const getProject = async (name: string): Promise<DetailedProjectDto> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetProject(name)
  return (await fun()).data
}

export const getProjectConfigOption = async () => {
  return await clientRequestWithAuth(CONFIG_OPTION, "get",)
}

export const createProject = async (data: CreateProjectDto): Promise<BaseProjectDto> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerCreateProject(data)
  return (await fun()).data
}

export const updateProject = async (projectId: string | number, data: EditProjectDto): Promise<BaseProjectDto> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerEditProject(projectId.toString(), data)
  return (await fun()).data
}

export const deleteProject = async (projectId: string | number,): Promise<void> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerDeleteProject(projectId.toString())
  return (await fun()).data
}

export const pinProject = async (projectId: string | number, data: ProjectMemberPreferencesDto): Promise<ProjectMemberPreferencesDto> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerUpdateMemberProjectPreferences(projectId.toString(), data)
  return (await fun()).data
}

export const confirmProjectInvitation = async (projectId: number,) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + CONFIRM, "post", {})
}

export const addNewMember = async (projectId: string | number, data: AddMemberToProjectDto): Promise<MemberResDto> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerAddMemberToProject(projectId.toString(), data)
  return (await fun()).data
}

export const updateMember = async (projectId: string | number, memberId: number, data: EditProjectMemberDto): Promise<MemberResDto> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerEditMember(projectId.toString(), memberId, data)
  return (await fun()).data
}

export const deleteMember = async (projectId: string | number, memberId: number) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerRemoveMemberFromProject(projectId.toString(), memberId)
  return (await fun()).data
}

export const addToken = async (projectId: string, data: CreateProjectTokenDto) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerCreateProjectToken(projectId, data)
  return (await fun()).data
}

export const getTokens = async (projectId: string): Promise<ProjectTokenDto[]> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetProjectTokens(projectId)
  return (await fun()).data
}

export const updateToken = async (projectId: string, tokenId: number, data: UpdateProjectTokenDto): Promise<ProjectTokenDto> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerUpdateProjectToken(projectId, tokenId, data)
  return (await fun()).data
}

export const deleteToken = async (projectId: string, tokenId: number,): Promise<void> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerDeleteProjectToken(projectId, tokenId)
  return (await fun()).data
}

export const getReleases = async (projectId: string): Promise<ReleaseDto[]> => {
  const fun = await ReleasesApiFp(await conf()).releasesControllerGetReleases(projectId)
  return (await fun()).data
}

export const setRelease = async (projectId: string, data: SetReleaseDto,): Promise<DetailedReleaseDto> => {  
  const fun = await ReleasesApiFp(await conf()).releasesControllerSetRelease(projectId, data)
  return (await fun()).data
}

export const getRelease = async (projectId: string, version: string,): Promise<DetailedReleaseDto> => {
  const fun = await ReleasesApiFp(await conf()).releasesControllerGetRelease(projectId, version)
  return (await fun()).data
}

export const deleteRelease = async (projectId: string, version: string): Promise<void> => {
  const fun = await ReleasesApiFp(await conf()).releasesControllerDeleteRelease(projectId, version)
  return (await fun()).data
}

export const getRegulationsTypes = async () => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetAllRegulationTypes()
  return (await fun()).data
}

export const getProjectRegulations = async (projectId: string) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetProjectRegulations(projectId)
  return (await fun()).data
}

export const addRegulation = async (projectId: string, data: CreateRegulationDto) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerCreateProjectRegulation(projectId, data)
  return (await fun()).data
}

export const updateRegulation = async (projectId: string, regId: string, data: UpdateRegulationDto) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerEditProjectRegulation(projectId, regId, data)
  return (await fun()).data
}

export const updateRegulations = async (projectId: string, data: UpdateOneOfManyRegulationDto[]) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerEditProjectRegulations(projectId, data)
  return (await fun()).data
}

export const deleteRegulation = async (projectId: string, regId: string) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerDeleteProjectRegulation(projectId, regId)
  return (await fun()).data
}

export const getProjectDocs = async (projectId: string) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetDocs(projectId)
  return (await fun()).data
}

export const getDoc = async (projectId: string, docId: number) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetDocById(projectId, docId)
  return (await fun()).data
}

export const addDoc = async (projectId: string, data: CreateDocDto) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerCreateDoc(projectId, data)
  return (await fun()).data
}

export const updateDoc = async (projectId: string, docId: number, data: UpdateDocDto) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerUpdateDoc(projectId, docId, data)
  return (await fun()).data
}

export const deleteDoc = async (projectId: string, docId: number) => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerDeleteDoc(projectId, docId)
  return (await fun()).data
}