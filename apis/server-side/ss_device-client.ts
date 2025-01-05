import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { SS_HttpClient } from "./ss_http-client";
import { DEVICES, SOFTWARE_META_DATA, DEVICE_INFO, GROUP, MAPS_META_DATA } from "../paths";
import { Device, DeviceMetaData, GroupRes } from "@/types/interfaces/devices";
import Logger from "@/services/logger";


export class SS_DeviceClient extends SS_HttpClient {

  logger = Logger(SS_DeviceClient.name)

  constructor(context: GetServerSidePropsContext) {
    super(context)
  }

  async getAllDevices(strParams?: string) {
    this.logger.info("Req all devices")
    try {
      const path = strParams ? DEVICES + "?" + strParams : DEVICES;
      let devices: Device[] = await (await this.httpConfig.get(path, await this.getReqConfig())).data;
      devices = devices.filter(device => device != null)
      return devices
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getDevicesSoftwareMetaData(strParams?: string) {
    this.logger.info("Req devices software meta data")
    try {
      const path = strParams ? SOFTWARE_META_DATA + "?" + strParams : SOFTWARE_META_DATA;
      let devices: DeviceMetaData = await (await this.httpConfig.get(path, await this.getReqConfig())).data;
      return devices
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
      let groups: GroupRes = await (await this.httpConfig.get(GROUP, await this.getReqConfig())).data;
      return groups
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

}
