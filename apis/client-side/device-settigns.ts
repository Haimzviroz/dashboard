import { clientRequestWithAuth } from './token-client.middleware';
import { DEVICE_CONFIG } from '../paths';
// (אופציונלי) אם יש לך טיפוס TS לתוצאה:
import { DeviceConfig } from '@/types/types/settings.type'

/**
 * מחזיר את ה-config של המכשיר ע"פ id ו-group
 */
export const getDeviceConfig = async (
  id: string,
  group: string
): Promise<DeviceConfig> => {
  const url = `${DEVICE_CONFIG}/${encodeURIComponent(id)}?group=${encodeURIComponent(group)}`;
  return await clientRequestWithAuth(url, 'get');
};
export const saveDeviceConfig = async (
  config: DeviceConfig
): Promise<void> => {
  const cleanCff = { ...config };
  if ('technicianPassword' in cleanCff) {
    delete cleanCff.technicianPassword;
  }
  return clientRequestWithAuth(DEVICE_CONFIG, 'put', cleanCff);
};
