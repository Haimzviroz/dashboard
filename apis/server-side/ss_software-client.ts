import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { SS_HttpClient } from "./ss_http-client";
import { OFFERED_SOFTWARE } from "../paths";
import Logger from "@/services/logger";
import { Software } from "@/types/interfaces/getapp";


export class SS_SoftwareClient extends SS_HttpClient {

  logger = Logger(SS_SoftwareClient.name)

  constructor(context: GetServerSidePropsContext) {
    super(context)
  }

  async getSoftWareById(catalogId: string) {
    this.logger.info("Req devices meta data")
    try {
      let software: Software = await (await this.httpConfig.get(OFFERED_SOFTWARE(catalogId), await this.getReqConfig())).data;
      return software
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

}
