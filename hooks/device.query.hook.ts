import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_DEVICE_MAP, Q_DEVICE_SOFTWARE, Q_DEVICES, Q_SOFTWARE_META_DATA, Q_DIST_ENTITY, Q_MAP, Q_MAP_META_DATA } from "../apis/query-keys";
import { getSoftwareMetaData, getDeviceWithMap, getDeviceWithSoftware, getDevices, putDeviceName, getMapMetaData } from "@/apis/client-side/devices-actions.api";
import { Device, DeviceMaps, DeviceSoftWare, DeviceMetaData } from "@/types/interfaces/devices";
import { Map } from "@/types/interfaces";
import { getMapById } from "@/apis/client-side/getmap-actions.api";
import { Software } from "@/types/interfaces/getapp";
import { getSoftwareById } from "@/apis/client-side/software-actions.api";
import { AppScopeEnum } from "@/types/enum";

export const useQ_Devices = (stringParams: string) => {

  const { data: devices, refetch } = useQuery<Device[]>({
    queryKey: [Q_DEVICES, stringParams],
    queryFn: () => getDevices(stringParams),
  })
  return { devices, refetch }
}

export const useMutateDevice = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (stringParams: string) => getDevices(stringParams),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data: any, variables: any) => {
      if (data) {
        client.setQueryData([Q_DEVICES], (() => data))
      }
    },
    onError: (error => alert(error))
  })
}

export const useMutateDeviceName = (catalogId?: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (params: { deviceId: string, name: string }) => {
      const { deviceId, name } = params;
      await putDeviceName(deviceId, name);
    },

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data: any, variables: any) => {
      if (catalogId) {
        client.setQueryData([Q_MAP, catalogId], ((map: Map) => {
          let devices = [...map.devices]
          const currentD = devices.findIndex(d => d.id === variables.deviceId)
          if (currentD !== -1) {
            devices[currentD] = { ...devices[currentD], name: variables.name }
          }
          return { ...map, devices }
        }))
      } else {
        client.setQueryData([Q_DEVICES], ((devices: Device[]) => {
          const updatedDevices = [...devices]
          const currentD = updatedDevices.findIndex(d => d.id === variables.deviceId)

          if (currentD !== -1) {
            updatedDevices[currentD] = { ...updatedDevices[currentD], name: variables.name }
          }
          return updatedDevices
        }))
      }
    },
    onError: (error => alert(error))
  })
}



// Device map
export const useDeviceMap = (id: string) => {
  const { data: device, isFetching } = useQuery<DeviceMaps>({
    queryKey: [Q_DEVICE_MAP, id],
    queryFn: () => getDeviceWithMap(id)
  })
  return { device, isFetching }
}


// Device software
export const useDeviceSoftware = (id: string, options?: any) => {
  const { data: device, isFetching } = useQuery<DeviceSoftWare>({
    queryKey: [Q_DEVICE_SOFTWARE, id],
    queryFn: () => getDeviceWithSoftware(id),
    ...options
  })
  return { device, isFetching }
}


// Device meta data
export const useDeviceMetaData = (stringParams: string | (() => string) | null = null, scope: AppScopeEnum) => {
  const params = typeof stringParams == "function" ? stringParams() : stringParams
  return scope == AppScopeEnum.getapp? useSoftwareMetaData(params) : useMapMetaData(params)
}

export const useSoftwareMetaData = (stringParams: string | null = null) => {
  const { data: metaData, refetch } = useQuery<DeviceMetaData>({
    queryKey: [Q_SOFTWARE_META_DATA, stringParams],
    queryFn: () => getSoftwareMetaData(stringParams)
  })
  return { metaData, refetch }
}

export const useMapMetaData = (stringParams: string | null = null) => {
  const { data: metaData, refetch } = useQuery<DeviceMetaData>({
    queryKey: [Q_MAP_META_DATA, stringParams],
    queryFn: () => getMapMetaData(stringParams)
  })
  return { metaData, refetch }
}


export const useDistEntity = (args?: [string, string | string[]]) => {
  const [type, catalogId] = args ?? [null, ""];

  const { data: dEntity, refetch } = useQuery<Software | Map>({
    queryKey: [Q_DIST_ENTITY, type],
    queryFn: () => {
      switch (type) {
        case "map":
          return getMapById(Array.isArray(catalogId) ? catalogId[0] : catalogId)
        case "software":
          return getSoftwareById(Array.isArray(catalogId) ? catalogId[0] : catalogId)
        default:
          return Promise.resolve(null)
      }
    }
  })
  return { dEntity, refetch }
}

export const useMutateDeviceMetaData = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (stringParams: string) => getSoftwareMetaData(stringParams),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data: any, variables: any) => {
      if (data) {
        client.setQueryData([Q_SOFTWARE_META_DATA], (() => data))
      }
    },
    onError: (error => alert(error))
  })
}


