import { conf } from './token-client.middleware';
import {
  DeliveryApiFp,
  PrepareDeliveryReqDto,
  PrepareDeliveryResDto
} from '@/api/src';

export const prepareDelivery = async (data: PrepareDeliveryReqDto): Promise<PrepareDeliveryResDto> => {
  const res = await DeliveryApiFp(await conf()).deliveryControllerPrepareDelivery(data)
  return (await res()).data
}
