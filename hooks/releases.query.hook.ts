import { useQuery } from "@tanstack/react-query";
import { Q_RELEASES } from "../apis/query-keys";
import { getReleases } from "@/apis/client-side/projects-actions.api";
import { ReleaseDto } from "@/api/src";

export const useReleases = (projectName:string) => {
  const { data: releases, refetch } = useQuery<ReleaseDto[]>({
    queryKey: [Q_RELEASES],
    queryFn: () => getReleases(projectName),
  })
  return { releases, refetch }
}

