import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_TOKENS } from "../apis/query-keys";
import { getTokens, updateToken, deleteToken, addToken } from "@/apis/client-side/projects-actions.api";
import { CreateProjectTokenDto, ProjectTokenDto, UpdateProjectTokenDto } from "@/api/src";

export const useTokens = (project: string) => {
  const { data: tokens, refetch } = useQuery<ProjectTokenDto[]>({
    queryKey: [Q_TOKENS, project],
    queryFn: () => getTokens(project),
  })
  return { tokens, refetch }
}

export const useCreateToken = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (addMes: { projectName: string, data: CreateProjectTokenDto }) =>
      addToken(addMes.projectName, addMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: ProjectTokenDto, addMes: { projectName: string, data: CreateProjectTokenDto }) => {
      client.setQueryData([Q_TOKENS, addMes.projectName], (preData: ProjectTokenDto[]) => {
        const copyData = [...preData]
        copyData.push(data)
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}

export const useUpdateToken = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (updateMes: { projectName: string, tokenId: number, data: UpdateProjectTokenDto }) =>
      updateToken(updateMes.projectName, updateMes.tokenId, updateMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: ProjectTokenDto, updateMes: { projectName: string, tokenId: number, data: UpdateProjectTokenDto }) => {

      client.setQueryData([Q_TOKENS, updateMes.projectName], (preData: ProjectTokenDto[]) => {
        const copyData = [...preData]

        const currentT = copyData.findIndex(m => m.id === updateMes.tokenId)
        if (currentT !== -1) {
          copyData[currentT] = { ...data }
        }

        return [...copyData]
      })
    },
    onError: (error => alert(error))
  })
}

export const useDeleteToken = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (delMes: { projectName: string, tokenId: number }) =>
      deleteToken(delMes.projectName, delMes.tokenId),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, delMes: { projectName: string, tokenId: number }) => {

      client.setQueryData([Q_TOKENS, delMes.projectName], (preData: ProjectTokenDto[]) => {
        const copyData = [...preData.filter(token => token.id !== delMes.tokenId)];
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}
