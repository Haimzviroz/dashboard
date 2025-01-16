import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig } from "axios";
import { LOGIN, REFRESH } from "../paths";
import { GetServerSidePropsContext } from "next";
import { SS_HttpConfig } from "./ss_client-config";
import { Auth } from "@/types/interfaces";
import Logger from "@/services/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface GetReqConfigOptions {
  withTokens?: boolean
  basePath?: string
}


export class SS_HttpClient {

  protected httpConfig: AxiosInstance
  private ctx: GetServerSidePropsContext;
  private accessToken: String | undefined;
  private refreshToken: String | undefined;
  private params: { [key: string]: string } | undefined;
  private query: { [key: string]: string };
  headers?: AxiosHeaders;
  logger = Logger(SS_HttpClient.name)
  static logger = Logger(SS_HttpClient.name)

  constructor(context: GetServerSidePropsContext) {
    this.ctx = context
    this.params = this.ctx.params as {};
    this.query = this.ctx.query as {};
    // const { accessToken, refreshToken } = context.req.cookies
    // this.setTokens({ accessToken, refreshToken } as Auth)
    this.httpConfig = SS_HttpConfig.getInstance().httpConfig
  }

  setTokens(tokens: Auth) {
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
  }

  getParam(key: string) {
    return this.params ? this.params[key] : undefined
  }

  getQuery(key: string) {
    return this.query[key] ? this.query[key] : null
  }

  async getRefreshToken() {
    this.logger.info("Req refresh token")

    const tokens: Auth = (await this.httpConfig.post(LOGIN + REFRESH, { refreshToken: this.refreshToken })).data

    // Need first to "set cookie" before set "this vars" due the conditions of set cookies    
    this.setTokensToCookiesHeader(tokens)
    this.setTokens(tokens)
  }

  static async getRefreshToken(refreshToken: string) {
    SS_HttpClient.logger.info("Req refresh token from sso server")

    const url: string = process.env.ISSUER + "/protocol/openid-connect/token"
    const data = {
      client_secret: process.env.SECRET_KEY,
      client_id: process.env.CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    try {
      const tokens = (await axios.post(url, data, config)).data
      return tokens
    } catch (error: any) {
      SS_HttpClient.logger.error("error when req refresh token from sso server - " + error.toString())
      throw error
    }
  }

  setTokensToCookiesHeader(tokens: Auth) {
    const cookies = [];

    if (tokens.accessToken != this.accessToken) {
      cookies.push(`accessToken=${tokens.accessToken}; Path=/`)
    }

    if (tokens.refreshToken != this.refreshToken) {
      cookies.push(`refreshToken=${tokens.refreshToken}; Path=/`)
    }

    if (cookies.length) {
      this.ctx.res.setHeader('set-cookie', cookies)
    }
  }



  async getReqConfig(options?: GetReqConfigOptions): Promise<AxiosRequestConfig & { [Key: string]: any } | undefined> {
    const session = await getServerSession(this.ctx.req, this.ctx.res, authOptions)
    const tokens: Auth = { accessToken: session?.token.accessToken ?? "", refreshToken: session?.token.refreshToken ?? "" }

    // Need first to "set cookie" before set "this vars" due the conditions of set cookies    
    this.setTokensToCookiesHeader(tokens)
    this.setTokens(tokens)

    let headers: any = {
      Authorization: `bearer ${this.accessToken}`,
    }
    if (options?.withTokens) {
      headers = {
        ...headers, token: JSON.stringify({
          accessToken: this.accessToken,
          refreshToken: this.refreshToken
        })
      }
    }

    return {
      headers,
      baseURL: options?.basePath || undefined
    }
  }




  async errorHandler(error: AxiosError) {
    throw error

    // if (!error.response || !error.response.status || error.response.status != 401) {
    //   this.logger.error(error, "Unknown error")
    //   throw error
    // }

    // await this.getRefreshToken()

    // const originalRequest = error.config as any
    // const newHeaders = this.getReqConfig({ withTokens: true })
    // originalRequest.headers.Authorization = newHeaders?.headers?.Authorization
    // originalRequest.headers.token = newHeaders?.headers?.token
    // return (await axios(originalRequest)).data
  }


  async pagesErrorHandler(error: any) {
    const data = error.response?.data
    if ((data?.statusCode >= 400 && data?.path == '/api/login/refresh/') || data?.statusCode === 401) {
      this.logger.error(data, "Refresh token expired");

      return {
        props: {
          tokenError: {
            statusCode: data.statusCode,
            message: data.message
          }
        }
      }
    }
    if (data?.statusCode >= 400 && data?.statusCode < 500) {
      this.logger.error(data)

      return {
        props: {
          error: {
            statusCode: data.statusCode,
            message: data.message
          }
        }
      }
    }
    if ((data?.statusCode === 500 && data?.message == 'Forbidden resource')) {
      this.logger.error(data, "Forbidden")

      return { notFound: true };
    }
    else {
      this.logger.error(data ?? error.toString(), "Unknown error")
      throw data ?? error.toString()
    }
  }
}
