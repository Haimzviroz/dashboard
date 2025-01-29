import { useQuery } from "@tanstack/react-query";
import { Q_REGULATIONS } from "../apis/query-keys";
import { getProjectRegulations } from "@/apis/client-side/projects-actions.api";
import { RegulationDto } from "@/api/src";

export const useRegulations = (projectName:string) => {
  const { data: regulations, refetch } = useQuery<RegulationDto[]>({
    queryKey: [Q_REGULATIONS, projectName],
    queryFn: () => getProjectRegulations(projectName),
  })
  return { regulations, refetch }
}
