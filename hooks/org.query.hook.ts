import { Q_ORG_IDS } from "@/apis/query-keys";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrgIds, createOrgId, editOrgId } from '@/apis/client-side/org-ids.api';
import { OrgIdPutDto } from "@/api/src";

export const useOrgIds = (params?: { group?: number, emptyGroup?: boolean, emptyDevice?: boolean }) => {
  return useQuery({
    queryKey: [Q_ORG_IDS, params],
    queryFn: () => getOrgIds(params),
  });
};

export const useCreateOrgId = (params?: { group?: number, emptyGroup?: boolean, emptyDevice?: boolean }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrgId,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [Q_ORG_IDS, params]});
    },
  });
};

export const useEditOrgId = (params?: { group?: number, emptyGroup?: boolean, emptyDevice?: boolean }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: number; data: OrgIdPutDto }) => editOrgId(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [Q_ORG_IDS, params]});
    },
  });
};
