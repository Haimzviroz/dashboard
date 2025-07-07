import { DashNavBarOption, ProNavBarOption, SideBarOption } from "@/types/enum";
import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";

export interface GetAppProviderProps {
  router: NextRouter
  proNavBarActive: ProNavBarOption | null
  setProNavBarActive: Dispatch<SetStateAction<ProNavBarOption | null>>;
  dashNavBarActive: DashNavBarOption | null
  setDashNavBarActive: Dispatch<SetStateAction<DashNavBarOption | null>>;
}