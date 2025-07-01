import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_PLATFORMS, Q_DEVICE_TYPES, Q_PLATFORM_HIERARCHY } from "@/apis/query-keys";
import { getPlatforms, getDeviceTypes, createDeviceType, updateDeviceType, deleteDeviceType, createPlatform, updatePlatform, deletePlatform, getPlatformHierarchy, assignDeviceTypeToPlatform, removeDeviceTypeFromPlatform } from "@/apis/client-side/hierarchy-actions.api";
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from "@/api/src";

export const usePlatforms = () => {
  const { data: platforms, refetch } = useQuery({
    queryKey: [Q_PLATFORMS],
    queryFn: () => getPlatforms(),
  });
  return { platforms, refetch };
};

export const useDeviceTypes = () => {
  const { data: deviceTypes, refetch } = useQuery({
    queryKey: [Q_DEVICE_TYPES],
    queryFn: () => getDeviceTypes(),
  });
  return { deviceTypes, refetch };
};

export const useCreateDeviceType = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateDeviceTypeDto) => createDeviceType(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_DEVICE_TYPES] }),
    onError: (error) => alert(error),
  });
};

export const useUpdateDeviceType = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: UpdateDeviceTypeDto }) => updateDeviceType(id, dto),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_DEVICE_TYPES] }),
    onError: (error) => alert(error),
  });
};

export const useDeleteDeviceType = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteDeviceType(id),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_DEVICE_TYPES] }),
    onError: (error) => alert(error),
  });
};

export const useCreatePlatform = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { name: string; description: string }) => createPlatform(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_PLATFORMS] }),
    onError: (error) => alert(error),
  });
};

export const useUpdatePlatform = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: { name: string; description: string } }) => updatePlatform(id, dto),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_PLATFORMS] }),
    onError: (error) => alert(error),
  });
};

export const useDeletePlatform = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deletePlatform(id),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_PLATFORMS] }),
    onError: (error) => alert(error),
  });
};

export const usePlatformHierarchy = (platformId: number) => {
  return useQuery({
    queryKey: [Q_PLATFORM_HIERARCHY, platformId],
    queryFn: () => getPlatformHierarchy(platformId),
    enabled: !!platformId,
  });
};

export const useAssignDeviceTypeToPlatform = (platformId: number) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ platformId, deviceTypeIds }: { platformId: number; deviceTypeIds: number }) => assignDeviceTypeToPlatform(platformId, deviceTypeIds),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_PLATFORM_HIERARCHY, platformId] }),
    onError: (error) => alert(error),
  });
};

export const useRemoveDeviceTypeFromPlatform = (platformId: number) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ platformId, deviceTypeId }: { platformId: number; deviceTypeId: number }) => removeDeviceTypeFromPlatform(platformId, deviceTypeId),
    onSuccess: () => client.invalidateQueries({ queryKey: [Q_PLATFORM_HIERARCHY, platformId] }),
    onError: (error) => alert(error),
  });
};
