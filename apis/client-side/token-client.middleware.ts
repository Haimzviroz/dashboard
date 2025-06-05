import axios, { Method, AxiosError, AxiosRequestConfig } from 'axios';
import { clientGetRefreshToken } from './login.api';
import { BASE_PATHS } from '../paths';
import { getSession, signIn } from 'next-auth/react';
import { jwtDecode } from 'jwt-decode';
import Logger from '@/services/logger';
import { Configuration } from '@/api/src';

const logger = Logger(__filename)

const clientRequestWithAuth = async (url: string, method: Method, data?: any, options?: AxiosRequestConfig) => {
  logger.info(`Http req to path ${url}`)
  const token = await getValidAccessToken()

  try {
    const response = await axios({
      method,
      url: `${url}`,
      data,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.accessToken}`,
      },
      baseURL: options?.baseURL ?? `${BASE_PATHS}/api/v1/`
    });
    return response.data;
  } catch (error: any) {
    logger.error(error, `Error when req to path ${url}`)
    if (token.token?.tokenError) {
      logger.error(token.token.tokenError)
      return signIn("keycloak")
    }

    // if (error?.response?.status) {

    //   const status = error.response.status
    //   const originalRequest = error.config

    //   if (status == 401) {
    //     try {
    //       const newAccessToken = await clientGetRefreshToken()
    //       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
    //       const response = await axios(originalRequest)
    //       return response.data
    //     } catch (error) {
    //       throw (error)
    //     }
    //   }
    //   throw (error)
    // }
    throw (error)
  }
}

const setCookie = (cName: string, cValue: string, exDays?: number) => {
  let expires = ''
  if (exDays) {
    const d = new Date();
    if (exDays > 0) {
      d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    } else {
      d.setTime(1);
    }
    expires = "expires=" + d.toUTCString() + ";";
  }
  document.cookie = cName + "=" + cValue + ";" + expires + " Path=/";
}

const getCookie = (cname: any) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";

}

const getValidAccessToken = async () => {
  logger.info("Get valid access token")
  let accessToken = getCookie("accessToken")
  const decodedToken = jwtDecode(accessToken);
  if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
    logger.info("Access token expire, wait for a new")
    const session = (await getSession())
    !session && signIn("keycloak")
    setCookie("accessToken", session?.token.accessToken ?? "");
    setCookie("refreshToken", session?.token.refreshToken ?? "");
    return {
      accessToken: session?.token.accessToken,
      token: session?.token
    }
  }
  return { accessToken }
}

const conf = async () => new Configuration({ basePath: BASE_PATHS, accessToken: (await getValidAccessToken()).accessToken })


export {
  clientRequestWithAuth,
  setCookie,
  getCookie,
  conf
};