import { GetServerSidePropsContext } from 'next';
import { PlatformsApiFp, DeviceTypesApiFp } from '@/api/src';
import { SS_HttpClient } from './ss_http-client';
import Logger from '@/services/logger';

export class SS_HierarchyClient extends SS_HttpClient {
  logger = Logger(SS_HierarchyClient.name);

  constructor(context: GetServerSidePropsContext) {
    super(context);
  }

  async getPlatforms() {
    this.logger.info('Req all platforms');
    try {
      const fun = await PlatformsApiFp(await this.getOpenApiConf()).hierarchyControllerGetPlatforms("");
      const res = await fun();
      return res.data || [];
    } catch (error) {
      return this.errorHandler(error as any);
    }
  }

  async getDeviceTypes() {
    this.logger.info('Req all device types');
    try {
      const fun = await DeviceTypesApiFp(await this.getOpenApiConf()).hierarchyControllerGetDeviceTypes("");
      const res = await fun();
      return res.data || [];
    } catch (error) {
      return this.errorHandler(error as any);
    }
  }
}
