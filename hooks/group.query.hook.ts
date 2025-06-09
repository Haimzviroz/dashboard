import { useQuery } from "@tanstack/react-query";
import { Q_GROUP, Q_GROUPS } from "../apis/query-keys";
import { getGroup, getGroups } from "@/apis/client-side/devices-actions.api";
import { ChildGroupDto, GroupResponseDto } from "@/api/src";

export const useGroups = () => {
  const { data: groups } = useQuery<GroupResponseDto>({
    queryKey: [Q_GROUPS],
    queryFn: getGroups,
  })
  return { groups }
}

export const useGroup = (id: number, option?: any) => {
  const { data: group, refetch } = useQuery<ChildGroupDto>({
    queryKey: [Q_GROUP, id],
    queryFn: () => getGroup(id),
    ...option
  })
  return { group, refetch }
}
