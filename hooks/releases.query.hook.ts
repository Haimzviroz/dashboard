import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_RELEASES } from "../apis/query-keys";
import { deleteRelease, getReleases } from "@/apis/client-side/projects-actions.api";
import { ReleaseDto } from "@/api/src";

export const useReleases = (projectName:string) => {
  const { data: releases, refetch } = useQuery<ReleaseDto[]>({
    queryKey: [Q_RELEASES],
    queryFn: () => getReleases(projectName),
  })
  return { releases, refetch }
}

export const useDeleteRelease = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (delMes: { projectName: string, version: string }) =>
      deleteRelease(delMes.projectName, delMes.version),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, delMes: { projectName: string, version: string }) => {

      client.setQueryData([Q_RELEASES], (preData: ReleaseDto[]) => {
        const copyData = [...preData.filter(release => release.version !== delMes.version)];
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}
