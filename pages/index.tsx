import { R_APP_DEVICES, R_PROJECTS } from "@/apis/routes";
import LoginPage from "@/components/main/page";
import { FC } from "react"

const HomePage: FC = () => {
  return <LoginPage routePath={R_PROJECTS} />
}

export default HomePage
