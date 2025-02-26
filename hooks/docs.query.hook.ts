import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_DOC, Q_DOCS } from "../apis/query-keys";
import { addDoc, deleteDoc, getDoc, getProjectDocs, updateDoc } from "@/apis/client-side/projects-actions.api";
import { CreateDocDto, DocDto, UpdateDocDto } from "@/api/src";


export const useDocs = (projectName: string) => {
  const { data: docs, refetch } = useQuery<DocDto[]>({
    queryKey: [Q_DOCS, projectName],
    queryFn: () => getProjectDocs(projectName),
  })
  return { docs, refetch }
}

export const useDoc = (projectName: string, docId: number) => {
  const { data: doc, refetch } = useQuery<DocDto>({
    queryKey: [Q_DOC, docId],
    queryFn: () => getDoc(projectName, docId),
  })
  return { doc, refetch }
}

export const useAddDoc = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (addMes: { projectName: string, data: CreateDocDto }) =>
      addDoc(addMes.projectName, addMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: DocDto, addMes: { projectName: string, data: CreateDocDto }) => {
      client.setQueryData([Q_DOCS, addMes.projectName], (preData: DocDto[]) => {
        return [...preData, data]
      })
    },
    onError: (error => alert(error))
  })
}

export const useUpdateDoc = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (updateMes: { projectName: string, docId: number, data: UpdateDocDto }) =>
      updateDoc(updateMes.projectName, updateMes.docId, updateMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: DocDto, updateMes: { projectName: string, docId: number, data: UpdateDocDto }) => {
      client.setQueryData([Q_DOC, updateMes.docId], (preData: DocDto) => {
        const copyData = {...preData, ...data}
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}

export const useDeleteDoc = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (delMes: { projectName: string, docId: number, }) =>
      deleteDoc(delMes.projectName, delMes.docId),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, delMes: { projectName: string, docId: number, }) => {

      client.setQueryData([Q_DOCS, delMes.projectName], (preData: DocDto[]) => {
        return preData.filter(d => d.id !== delMes.docId)
      })
    },
    onError: (error => alert(error))
  })
}
