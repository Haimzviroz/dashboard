import { ReactNode } from "react"

export * from "./rtl-mui.provider"
export * from "./team-mui.provider"

export interface BaseProvider {
  children: ReactNode
}