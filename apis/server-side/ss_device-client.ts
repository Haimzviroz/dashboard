import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { SS_HttpClient } from "./ss_http-client";
import { MAPS_META_DATA } from "../paths";
import { DeviceMetaData } from "@/types/interfaces/devices";
import Logger from "@/services/logger";
import { DeviceApiFp, OrganizationGroupsApiFp,  } from "@/api/src";


export class SS_DeviceClient extends SS_HttpClient {

  logger = Logger(SS_DeviceClient.name)

  constructor(context: GetServerSidePropsContext) {
    super(context)
  }

  async getAllDevices(groups?: string | string[]) {
    this.logger.info("Req all devices")
    try {
      groups && (groups = Array.isArray(groups) ? groups : [groups])
      const fun = await DeviceApiFp(await this.getOpenApiConf()).deviceControllerGetRegisteredDevices(groups as string[])
      let devices = (await fun()).data
      devices = devices.filter(device => device != null)
      return devices
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getDevicesSoftwareMetaData(groups?: string | string[], software?: string |string[]) {
    this.logger.info("Req devices software meta data")
    try {
      groups && (groups = Array.isArray(groups) ? groups : [groups])
      software && (software = Array.isArray(software) ? software : [software])
      const fun = await DeviceApiFp(await this.getOpenApiConf()).deviceControllerGetDevicesSoftwareStatisticInfo(groups as string[], software as string[]);
      return (await fun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getDevicesMapMetaData(strParams?: string) {
    this.logger.info("Req devices map meta data")
    try {
      const path = strParams ? MAPS_META_DATA + "?" + strParams : MAPS_META_DATA;
      let devices: DeviceMetaData = await (await this.httpConfig.get(path, await this.getReqConfig())).data;
      return devices
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getGroups() {
    this.logger.info("Req all root groups")
    try {
      const fun = await OrganizationGroupsApiFp(await this.getOpenApiConf()).groupControllerGetGroups();
      return (await fun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

}
