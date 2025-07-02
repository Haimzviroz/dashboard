import { R_CATALOG } from "@/apis/routes";
import LoginPage from "@/components/main/page";
import { FC } from "react"

const HomePage: FC = () => {
  return <LoginPage routePath={R_CATALOG} />
}

export default HomePage
