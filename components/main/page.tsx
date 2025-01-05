import Logger from "@/services/logger";
import LoadingSpinner, { TargetType } from "@/ui/spinner/spinner";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react"

interface PageProps {
  routePath: string
  pageName?: string
  tokenError?: {
    statusCode: string,
    message: string
  }
}

const LoginPage: FC<PageProps> = ({ routePath, pageName, tokenError }) => {
  const logger = Logger(LoginPage.name + pageName)

  const { data: session, status } = useSession()
  const router = useRouter();

  useEffect(() => {
    logger.info(`session status is ${status}`)
    if (session && status == "authenticated") {
      if (session.token.tokenError && session.token.tokenError === "refresh token expire") {
        signIn("keycloak")
      } else if (tokenError) {
        router.push({
          pathname: "/error",
          query: { ...router.query, ...tokenError } as any,
        })

      } else {
        router.push(routePath);
      }
    }

    if (status == "unauthenticated") {
      signIn("keycloak")
    }
  }, [session])

  return <LoadingSpinner target={TargetType.loading}></LoadingSpinner>
}

export default LoginPage
