import { IUserLogin } from "@/types/interfaces/user-login.interface";
import axios from "axios";
import { BASE_PATHS, LOGIN, REFRESH } from "../paths";
import { setCookie, getCookie } from "./token-client.middleware";
import Router from "next/router";
import { Agent } from "https";
import { signIn, signOut } from "next-auth/react";
import getConfig from "next/config";
import Logger from "@/services/logger";

const logger = Logger(__filename)

export const login = async (data: IUserLogin) => {
  // try {
  //   const res = await axios.post(BASE_PATHS + LOGIN, data)
  //   setCookie("accessToken", res?.data?.accessToken)
  //   setCookie("refreshToken", res?.data?.refreshToken)
  //   return res
  // } catch (error) {
  //   throw (error)
  // }
}

export const clientGetRefreshToken = async () => {
  // logger.info("Req refresh token from client")
  // const body = { refreshToken: getCookie("refreshToken") }
  // try {
  //   const res = await axios.post(BASE_PATHS + LOGIN + REFRESH, body, {
  //     httpsAgent: new Agent({ rejectUnauthorized: false })
  //   })
  //   setCookie("accessToken", res?.data?.accessToken)
  //   setCookie("refreshToken", res?.data?.refreshToken)
  //   return res?.data?.accessToken
  // } catch (error: any) {
  //   logger.error(error, "client refresh error");
  //   signIn("keycloak")
  // }
}

// TODO using in server side need replace location of method
export const logOutSession = async (idToken: string) => {
  logger.info("Remove session form keycloak")
  const url = `${process.env.ISSUER}/protocol/openid-connect/logout?id_token_hint=${idToken}`
  return await axios.get(url)
}

export const handleSignOut = async () => {
  logger.info("Sign out")
  const signOutData = await signOut({
    redirect: false,
    callbackUrl: getConfig().publicRuntimeConfig.NEXTAUTH_URL,
  });
  Router.push(signOutData.url)
  setCookie("accessToken", "")
  setCookie("refreshToken", "")
}