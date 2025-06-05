import { OfferingApiFp } from '@/api/src';
import { conf } from './token-client.middleware';
import Logger from '@/services/logger';

const logger = Logger(__filename)

export const getSoftwareById = async (catalogId: string) => {
  logger.info(`Req software with id ${catalogId}`)
  const tokenFun = await OfferingApiFp(await conf()).offeringControllerGetOfferingOfComp(catalogId)
  return (await tokenFun()).data
}
