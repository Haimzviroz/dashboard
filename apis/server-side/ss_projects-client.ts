import { AxiosError } from "axios";
import { BASE_PATHS, PROJECT, PROJECT_RELEASES } from "../paths";
import { GetServerSidePropsContext } from "next";
import { SS_HttpClient } from "./ss_http-client";
import { ProjectApiFp, CatalogUploadApiFp } from "@/api/src";

export class SS_ProjectsClient extends SS_HttpClient {

  constructor(context: GetServerSidePropsContext) {
    super(context)
  }

  async getAllProjects() {
    this.logger.info("Get all projects");
    try {
      return (await this.httpConfig.get(PROJECT, await this.getReqConfig({ basePath: BASE_PATHS + "/api/v2" }))).data.data;
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getProjectByName(pName: string) {
    this.logger.info(`Get project '${pName}'`);
    try {
      return (await this.httpConfig.get(PROJECT + pName, await this.getReqConfig())).data;
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getProjectTokens(projectId: string) {
    try {
      const tokenFun = await ProjectApiFp(await this.getOpenApiConf()).projectManagementControllerGetProjectTokens(projectId)
      return (await tokenFun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getProjectReleases(projectId: string) {
    try {
      const tokenFun = await CatalogUploadApiFp(await this.getOpenApiConf()).releasesControllerGetReleases(projectId)
      return (await tokenFun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getDetailedRelease(projectId: string, version: string) {
    try {
      const tokenFun = await CatalogUploadApiFp(await this.getOpenApiConf()).releasesControllerGetRelease(projectId, version)
      return (await tokenFun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getProjectRegulations(projectId: string) {
    try {
      const tokenFun = await ProjectApiFp(await this.getOpenApiConf()).projectManagementControllerGetProjectRegulations(projectId)
      return (await tokenFun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getProjectDocs(projectId: string) {
    try {
      const tokenFun = await ProjectApiFp(await this.getOpenApiConf()).projectManagementControllerGetDocs(projectId)
      return (await tokenFun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

  async getProjectDoc(projectId: string, docId: number) {
    try {
      const tokenFun = await ProjectApiFp(await this.getOpenApiConf()).projectManagementControllerGetDocById(projectId, docId)
      return (await tokenFun()).data
    } catch (error) {
      return this.errorHandler(error as AxiosError)
    }
  }

}
