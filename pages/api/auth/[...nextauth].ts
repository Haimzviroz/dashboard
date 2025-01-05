import { logOutSession } from "@/apis/client-side/login.api";
import { SS_HttpClient } from "@/apis/server-side/ss_http-client";
import Logger from "@/services/logger";
import { jwtDecode } from "jwt-decode";
import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak";

const logger = Logger(NextAuth.name)

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.CLIENT_ID ?? "",
      clientSecret: process.env.SECRET_KEY ?? "",
      issuer: process.env.ISSUER,
      idToken: true,
      httpOptions: {
        timeout: 10000
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: Number.isInteger(Number(process.env.SESSION_MAX_AGE)) ? Number(process.env.SESSION_MAX_AGE) : 30 * 60 },
  callbacks: {
    async jwt({ token, account }): Promise<JWT> {

      // it trigged in the first time when logged in by the sso server
      if (account) {
        logger.info("Got account")
        return {
          ...token,
          accessToken: account.access_token,
          accessExpires: account.expires_at,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
        }
      }

      const timeNow = Math.floor(Date.now() / 1000)
      if (token.accessExpires && timeNow >= token.accessExpires) {
        logger.info("access token expire, req for a new")
        try {
          const newToken: any = await SS_HttpClient.getRefreshToken(token.refreshToken ?? "")
          return {
            ...token,
            accessToken: newToken.access_token,
            accessExpires: jwtDecode(newToken.access_token).exp,
            refreshToken: newToken.refresh_token,
            idToken: newToken.id_token,
          }
        } catch (error) {
          logger.info("refresh token expire")
          // await logOutSession(token.idToken ?? "")
          return {
            ...token,
            tokenError: "refresh token expire"
          }

        }
      }

      logger.info("Got token")
      return token;
    },

    async session({ session, token }: { session: Session, token: JWT }): Promise<Session> {
      logger.info("Got session")
      if (token) {
        session.token = token;
      }
      return session
    }
  },
  events: {
    async signOut(message) {
      logger.info("Sign out event")
      await logOutSession(message.token.idToken ?? "")
    },
  }
}

export default NextAuth(authOptions);