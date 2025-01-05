import { R_MAP_DEVICES } from "@/apis/routes";
import LoginPage from "@/components/main/page";
import { FC } from "react"

const HomePage: FC = () => {
  return <LoginPage routePath={R_MAP_DEVICES}/>
}

export default HomePage
