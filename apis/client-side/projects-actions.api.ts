import { PROJECT, CONFIG_OPTION, CONFIRM } from '../paths';
import { clientRequestWithAuth, conf } from './token-client.middleware';
import {
  AddMemberToProjectDto,
  BaseProjectDto,
  CreateProjectDto,
  CreateProjectTokenDto,
  DetailedProjectDto,
  EditProjectDto,
  EditProjectMemberDto,
  MemberResDto,
  ProjectApiFp,
  ProjectDto,
  ProjectMemberPreferencesDto,
  ProjectTokenDto,
  ReleaseDto,
  ReleasesApiFp,
  UpdateProjectTokenDto,
  UsersApiFactory,
  UserSearchDto
} from '@/api/src';

export const getUsers = async (params: UserSearchDto): Promise<MemberResDto[]> => {
  const res = await UsersApiFactory(await conf()).usersControllerGetAllUsers(params)
  return res.data
}

export const getProjects = async (): Promise<ProjectDto[]> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerGetProjects()
  return (await fun()).data.data
}

export const SearchProjects = async (name: string) => {
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
