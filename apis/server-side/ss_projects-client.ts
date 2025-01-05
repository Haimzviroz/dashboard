import { AxiosError } from "axios";
import { PROJECT, PROJECT_RELEASES } from "../paths";
import { GetServerSidePropsContext } from "next";
import { SS_HttpClient } from "./ss_http-client";

export class SS_ProjectsClient extends SS_HttpClient {

  constructor(context: GetServerSidePropsContext) {
    super(context)
  }

  async getAllProjects() {
    this.logger.info("Get all projects");
    
    try {
      return (await this.httpConfig.get(PROJECT, await this.getReqConfig())).data;
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getProjectReleases(projectId: string) {
    try {
      return (await this.httpConfig.get(PROJECT + projectId + PROJECT_RELEASES, await this.getReqConfig())).data;
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

}
