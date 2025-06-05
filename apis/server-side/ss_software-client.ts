import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { SS_HttpClient } from "./ss_http-client";
import Logger from "@/services/logger";
import { OfferingApiFp } from "@/api/src";


export class SS_SoftwareClient extends SS_HttpClient {

  logger = Logger(SS_SoftwareClient.name)

  constructor(context: GetServerSidePropsContext) {
    super(context)
  }

  async getSoftWareById(catalogId: string) {
    this.logger.info("Req devices meta data")
    try {
      const fun = await OfferingApiFp(await this.getOpenApiConf()).offeringControllerGetOfferingOfComp(catalogId)
      return (await fun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

}
