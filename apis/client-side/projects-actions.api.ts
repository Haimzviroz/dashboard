import { DetailedProject, SearchPro } from '@/types/interfaces';
import { MEMBER, PROJECT, CREATE_TOKEN, CONFIG_OPTION, CONFIRM, USERS, BASE_PATHS, SEARCH_PROJECT } from '../paths';
import { clientRequestWithAuth, conf } from './token-client.middleware';
import { BaseProjectDto, CreateProjectDto, CreateProjectTokenDto, DetailedProjectDto, EditProjectDto, ProjectApiFp, ProjectDto, ProjectTokenDto, UpdateProjectTokenDto } from '@/api/src';

export const getUsers = async (params: { [key: string]: string }) => {
  return await clientRequestWithAuth(USERS, "post", params)
}

export const getProjects = async () => {
  return (await clientRequestWithAuth(PROJECT, "get", null, { baseURL: BASE_PATHS + "/api/v2", })).data
}

export const SearchProjects = async (name: string): Promise<SearchPro[]> => {
  return (await clientRequestWithAuth(SEARCH_PROJECT + `?query=${name}`, "get", null)).data
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

export const deleteProject = async (projectId: string | number, ): Promise<void> => {
  const fun = await ProjectApiFp(await conf()).projectManagementControllerDeleteProject(projectId.toString())
  return (await fun()).data
}

export const confirmProjectInvitation = async (projectId: number,) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + CONFIRM, "post", {})
}

export const addNewMember = async (projectId: string | number, data: any) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + MEMBER, "post", data)
}

export const updateMember = async (projectId: string | number, memberId: number, data: any) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + MEMBER + memberId, "put", data)
}

export const deleteMember = async (projectId: string | number, memberId: number) => {
  const tokenFun = await ProjectApiFp(await conf()).projectManagementControllerRemoveMemberFromProject(projectId.toString(), memberId)
  return (await tokenFun()).data
}

export const addToken = async (projectId: string, data: CreateProjectTokenDto) => {
  const tokenFun = await ProjectApiFp(await conf()).projectManagementControllerCreateProjectToken(projectId, data)
  return (await tokenFun()).data
}

export const getTokens = async (projectId: string): Promise<ProjectTokenDto[]> => {
  const tokenFun = await ProjectApiFp(await conf()).projectManagementControllerGetProjectTokens(projectId)
  return (await tokenFun()).data
}

export const updateToken = async (projectId: string, tokenId: number, data: UpdateProjectTokenDto): Promise<ProjectTokenDto> => {
  const tokenFun = await ProjectApiFp(await conf()).projectManagementControllerUpdateProjectToken(projectId, tokenId, data)
  return (await tokenFun()).data
}

export const deleteToken = async (projectId: string, tokenId: number,): Promise<void> => {
  const tokenFun = await ProjectApiFp(await conf()).projectManagementControllerDeleteProjectToken(projectId, tokenId)
  return (await tokenFun()).data
}
