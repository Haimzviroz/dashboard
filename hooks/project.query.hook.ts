import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_PROJECT, Q_PROJECTS } from "../apis/query-keys";
import { addNewMember, deleteMember, getProject, getProjects, updateMember } from "@/apis/client-side/projects-actions.api";
import { AddMember, Member, Project, UpdateMember } from "@/types/interfaces";

export const useProjects = () => {
  const { data: projects, refetch } = useQuery<Project[]>({
    queryKey: [Q_PROJECTS],
    queryFn: () => getProjects(),
  })
  return { projects, refetch }
}

export const useProject = (name: string) => {
  const { data: project, refetch } = useQuery<any>({
    queryKey: [Q_PROJECT, name],
    queryFn: () => getProject(name),
  })
  return { project, refetch }
}

export const useAddMember = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (addMes: { projectName: string, data: AddMember }) =>
      addNewMember(addMes.projectName, addMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: Member, addMes: { projectName: string, data: AddMember }) => {

      client.setQueryData([Q_PROJECT, addMes.projectName], (preData: Project) => {
        const copyData = { ...preData }

        let members = [...copyData.members]
        members.push(data)
        copyData.members = members
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}

export const useUpdateMember = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (updateMes: { projectName: string, memberId: number, data: UpdateMember }) =>
      updateMember(updateMes.projectName, updateMes.memberId, updateMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: Member, updateMes: { projectName: string, memberId: number, data: UpdateMember }) => {

      client.setQueryData([Q_PROJECT, updateMes.projectName], (preData: Project) => {
        const copyData = { ...preData }

        let members = [...copyData.members]
        const currentM = members.findIndex(m => m.id === updateMes.memberId)
        if (currentM !== -1) {
          members[currentM] = { ...members[currentM], ...data }
        }
        copyData.members = members
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}

export const useDeleteMember = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (delMes: { projectName: string, memberId: number }) =>
      deleteMember(delMes.projectName, delMes.memberId),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: Member, delMes: { projectName: string, memberId: number }) => {

      client.setQueryData([Q_PROJECT, delMes.projectName], (preData: Project) => {
        const copyData = { ...preData }
        copyData.members = [...copyData.members.filter(member => member.id !== delMes.memberId)];
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}
