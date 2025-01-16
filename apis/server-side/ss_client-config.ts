import axios, { AxiosError, AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { Agent } from "https";
import * as fs from "fs";
import { BASE_PATHS, LOGIN, PROJECT, REFRESH } from "../paths";
import { error } from "console";
import { GetServerSidePropsContext } from "next";


export class SS_HttpConfig {

  httpConfig: AxiosInstance
  private static interface: SS_HttpConfig;

  private constructor() {   
    this.httpConfig = axios.create({
      baseURL: BASE_PATHS + "/api/v1",
      // httpsAgent: new Agent({
      //   // ca: fs.readFileSync(process.env.CA_CERT_PATH ?? ""),
      //   rejectUnauthorized: false 
      // })
    })
  }

  static getInstance() {
    if (!SS_HttpConfig.interface) {
      SS_HttpConfig.interface = new SS_HttpConfig()
    }
    return SS_HttpConfig.interface
  }

  
}