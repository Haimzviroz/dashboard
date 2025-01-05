import { DefaultJWT, JWT } from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  export interface JWT extends Record<string, unknown>, DefaultJWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    accessExpires?: number,
    tokenError?: string
  }
}

declare module "next-auth" {
  export interface Session extends DefaultSession{
    token: JWT
  }
}