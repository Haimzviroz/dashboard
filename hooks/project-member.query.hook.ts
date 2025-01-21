import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Q_PROJECT } from "../apis/query-keys";
import { addNewMember, deleteMember, updateMember } from "@/apis/client-side/projects-actions.api";
import { AddMemberToProjectDto, DetailedProjectDto, EditProjectMemberDto, MemberResDto } from "@/api/src";

export const useAddMember = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (addMes: { projectName: string, data: AddMemberToProjectDto }) =>
      addNewMember(addMes.projectName, addMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: MemberResDto, addMes: { projectName: string, data: AddMemberToProjectDto }) => {

      client.setQueryData([Q_PROJECT, addMes.projectName], (preData: DetailedProjectDto) => {
        const copyData = { ...preData }
        if (copyData.members) {
          let members = [...copyData.members]
          members.push(data)
          copyData.members = members
        }
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}

export const useUpdateMember = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (updateMes: { projectName: string, memberId: number, data: EditProjectMemberDto }) =>
      updateMember(updateMes.projectName, updateMes.memberId, updateMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: MemberResDto, updateMes: { projectName: string, memberId: number, data: EditProjectMemberDto }) => {

      client.setQueryData([Q_PROJECT, updateMes.projectName], (preData: DetailedProjectDto) => {
        const copyData = { ...preData }
        if (copyData.members) {

          let members = [...copyData.members]
          const currentM = members.findIndex(m => m.id === updateMes.memberId)
          if (currentM !== -1) {
            members[currentM] = { ...members[currentM], ...data }
          }
          copyData.members = members
        }
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}

export const useRemoveMember = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (delMes: { projectName: string, memberId: number }) =>
      deleteMember(delMes.projectName, delMes.memberId),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, delMes: { projectName: string, memberId: number }) => {

      client.setQueryData([Q_PROJECT, delMes.projectName], (preData: DetailedProjectDto) => {
        const copyData = { ...preData }
        if (copyData.members) {
          copyData.members = [...copyData.members.filter(member => member.id !== delMes.memberId)];
        }
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}
