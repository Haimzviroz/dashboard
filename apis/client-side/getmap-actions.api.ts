import { ProductsRes } from '@/types/interfaces';
import { MAPS, MAP, MAPS_OFFERING, IMPORT_CREATE, MAP_PUT } from '../paths';
import { SS_GetMapClient, offered } from '../server-side/ss_gm-maps-client';
import { clientRequestWithAuth } from './token-client.middleware';
import Logger from '@/services/logger';
import { CreateMap, ImportCreate } from '@/types/interfaces/getmap/gm-api.interfaces';

const logger = Logger(__filename)

export const getMaps = async () => {
  logger.info(`Req all maps`)
  return await clientRequestWithAuth(MAPS, "get")
}

export const getMapById = async (catalogId: string) => {
  logger.info(`Req map with id ${catalogId}`)
  return await clientRequestWithAuth(`${MAP}/${catalogId}`, "get")
}

export const putMapName = async (catalogId: string, name: string) => {
  return await clientRequestWithAuth(MAP_PUT(catalogId), "put", {name})
}

export const reqProducts = async () => {
  // return offered;
  return await clientRequestWithAuth(MAPS_OFFERING, "get")
}

export const getProducts = async () => {
  logger.info(`Req all product`)
  const data = await reqProducts()
  return SS_GetMapClient.editProductData(data as ProductsRes)
}

export const createMap = async (body: ImportCreate) => {
  logger.info(`Req import create`)
  return await clientRequestWithAuth(IMPORT_CREATE, "post", body)
}
