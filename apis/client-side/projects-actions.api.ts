import { MEMBER, PROJECT, CREATE_TOKEN, CONFIG_OPTION, DEVICES, CONFIRM, USERS } from '../paths';
import { clientRequestWithAuth } from './token-client.middleware';

export const getUsers = async (params: {[key:string]: string}) => {
  return await clientRequestWithAuth(USERS, "post", params)
}

export const getProjects = async () => {
  return await clientRequestWithAuth(PROJECT, "get")
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

export const addNewMember = async (projectId: number, data: any) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + MEMBER, "post", data)
}

export const updateMember = async (projectId: number, memberId: number, data: any) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + MEMBER + memberId, "put", data)
}

export const deleteMember = async (projectId: number, memberId: number, data: any) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + MEMBER + memberId, "delete", data)
}

export const addToken = async (projectId: number) => {
  return await clientRequestWithAuth(PROJECT + projectId + "/" + CREATE_TOKEN, "post")
}
