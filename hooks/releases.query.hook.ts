import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_RELEASE, Q_RELEASES } from "../apis/query-keys";
import { deleteRelease, getReleases, getRelease, setRelease } from "@/apis/client-side/projects-actions.api";
import { DetailedReleaseDto, ReleaseDto, SetReleaseDto } from "@/api/src";

export const useReleases = (projectName: string) => {
  const { data: releases, refetch } = useQuery<ReleaseDto[]>({
    queryKey: [Q_RELEASES, projectName],
    queryFn: () => getReleases(projectName),
  })
  return { releases, refetch }
}

export const useRelease = (projectName: string, version: string) => {
  const { data: release, refetch } = useQuery<DetailedReleaseDto>({
    queryKey: [Q_RELEASE, version],
    queryFn: () => getRelease(projectName, version),
  })
  return { release, refetch }
}

export const useSetRelease = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (addMes: { projectName: string, data: SetReleaseDto }) =>
      setRelease(addMes.projectName, addMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: DetailedReleaseDto, addMes: { projectName: string, data: SetReleaseDto }) => {
      client.setQueryData([Q_RELEASE, addMes.data.version], (preData: DetailedReleaseDto) => {
        return { ...preData, ...data }
      })
      client.refetchQueries({ queryKey: [Q_RELEASES, addMes.projectName] })
    },
    onError: (error => alert(error))
  })
}

export const useDeleteRelease = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (delMes: { projectName: string, version: string }) =>
      deleteRelease(delMes.projectName, delMes.version),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, delMes: { projectName: string, version: string }) => {
      client.setQueryData([Q_RELEASES, delMes.projectName], (preData: ReleaseDto[]) => {
        const copyData = [...preData.filter(release => release.version !== delMes.version)];
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}
