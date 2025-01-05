import { OFFERED_SOFTWARE } from '../paths';
import { clientRequestWithAuth } from './token-client.middleware';
import Logger from '@/services/logger';

const logger = Logger(__filename)

export const getSoftwareById = async (catalogId: string ) => {
  logger.info(`Req software with id ${catalogId}`)
  return await clientRequestWithAuth(OFFERED_SOFTWARE(catalogId), "get")
}
