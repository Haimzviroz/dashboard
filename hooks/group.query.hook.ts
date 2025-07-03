import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Q_GROUP, Q_GROUPS } from "../apis/query-keys";
import { getGroup, getGroups, createGroup, updateGroup, deleteGroup } from "@/apis/client-side/devices-actions.api";
import { ChildGroupDto, GroupResponseDto, CreateDevicesGroupDto, EditDevicesGroupDto } from "@/api/src/api";

export const useGroups = (option?:any) => {
  const { data: groups } = useQuery<GroupResponseDto>({
    queryKey: [Q_GROUPS],
    queryFn: getGroups,
    ...option
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

// Create Group Mutation
export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ChildGroupDto, unknown, CreateDevicesGroupDto>({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Q_GROUPS] });
    },
  });
};

// Update Group Mutation
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ChildGroupDto, unknown, { id: number; data: EditDevicesGroupDto }>({
    mutationFn: ({ id, data }) => updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Q_GROUPS] });
    },
  });
};

// Delete Group Mutation
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ChildGroupDto, unknown, number>({
    mutationFn: (id: number) => deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Q_GROUPS] });
    },
  });
};
