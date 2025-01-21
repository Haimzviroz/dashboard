import { DetailedProject, SearchPro } from '@/types/interfaces';
import { MEMBER, PROJECT, CREATE_TOKEN, CONFIG_OPTION, CONFIRM, USERS, BASE_PATHS, SEARCH_PROJECT } from '../paths';
import { clientRequestWithAuth, conf } from './token-client.middleware';
import { CreateProjectTokenDto, ProjectApiFp, ProjectTokenDto, UpdateProjectTokenDto } from '@/api/src';

export const getUsers = async (params: { [key: string]: string }) => {
  return await clientRequestWithAuth(USERS, "post", params)
}

export const getProjects = async () => {
  return (await clientRequestWithAuth(PROJECT, "get", null, { baseURL: BASE_PATHS + "/api/v2", })).data
}

export const SearchProjects = async (name: string): Promise<SearchPro[]> => {
  return (await clientRequestWithAuth(SEARCH_PROJECT + `?query=${name}`, "get", null)).data
}

export const getProject = async (name: string): Promise<DetailedProject> => {
  return await clientRequestWithAuth(PROJECT + name, "get")
}

export const getProjectConfigOption = async () => {
  return await clientRequestWithAuth(CONFIG_OPTION, "get",)
}

export const addNewProject = async (data: any) => {
  return await clientRequestWithAuth(PROJECT, "post", data)
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
  return await clientRequestWithAuth(PROJECT + projectId + "/" + MEMBER + memberId, "delete")
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
