import { R_APP_DEVICES } from "@/apis/routes";
import LoginPage from "@/components/main/page";
import { FC } from "react"

const HomePage: FC = () => {
  return <LoginPage routePath={R_APP_DEVICES} />
}

export default HomePage
