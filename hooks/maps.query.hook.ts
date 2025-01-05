import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Q_MAP, Q_MAPS, Q_PRODUCTS } from "../apis/query-keys";
import { createMap, getMapById, getMaps, getProducts, putMapName } from "../apis/client-side/getmap-actions.api"
import { Maps, Map, ProductsRes, MapState } from '@/types/interfaces';
import { getDeviceWithMap } from "@/apis/client-side/devices-actions.api";
import { ImportCreate } from "@/types/interfaces/getmap/gm-api.interfaces";
import Router from "next/router";

export const useMaps = (deviceID: string | null = null) => {
  const { data: maps, isFetched, refetch } = useQuery<Maps[]>({
    queryKey: [Q_MAPS, deviceID],
    queryFn: deviceID ? async () => (await getDeviceWithMap(deviceID)).maps.map((m: MapState) => m.map) : getMaps,
  })
  return { maps, isFetched, refetch }
}

export const useMap = (id: string, options?: any) => {
  const { data: map, refetch, isFetched } = useQuery<Map>({
    queryKey: [Q_MAP, id],
    queryFn: () => getMapById(id),
    ...options
  })
  return { map, refetch, isFetched }
}

export const useCreateMap = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (mapProps: ImportCreate) => createMap(mapProps),
    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: any, variables: ImportCreate) => {
      if(data.error){
        throw new Error(data.error.message)
      }
      const id = data.importRequestId
      const newMap = await getMapById(id) as Map
      newMap.isCollapsed = true
      client.setQueryData([Q_MAP, id], () => {
        return newMap
      })
      client.setQueryData([Q_MAPS, null], (maps: Maps[]) => {
        const copyMaps = [newMap, ...maps]
        return copyMaps
      })
      // Router.push("/getmap/maps/[catalogId]", "/getmap/maps/" + data.importRequestId, { shallow: true })
    },

    onError: (error => alert(error.message))
  })
}

export const useMutateMapName = (deviceID: string | null = null) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (params: { catalogId: string, name: string }) => {
      const { catalogId, name } = params;
      await putMapName(catalogId, name);
    },

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data: any, variables: any) => {
      client.setQueryData([Q_MAPS, deviceID], ((maps: Maps[]) => {
        const updatedMaps = [...maps]
        const currentM = updatedMaps.findIndex(m => m.catalogId === variables.catalogId)

        if (currentM !== -1) {
          updatedMaps[currentM] = { ...updatedMaps[currentM], name: variables.name }
        }
        return updatedMaps
      }))
    },
    onError: (error => alert(error)),
  })
}

export const useProducts = (options?: any) => {
  const { data: products } = useQuery<ProductsRes>({
    queryKey: [Q_PRODUCTS],
    queryFn: getProducts,
    ...options
  })
  return products
}