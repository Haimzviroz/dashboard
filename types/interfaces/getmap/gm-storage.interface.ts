import { NavBarOption, SideBarOption } from "@/types/enum";
import { Dispatch, SetStateAction } from "react";
import { Group } from "../devices";
import { NextRouter } from "next/router";

export interface GetAppProviderProps {
  router: NextRouter
  selectedGroup: number[],
  setSelectedGroup: Dispatch<SetStateAction<number[]>>,
  setGroupInSelectedGroup: (group: Group) => void,
  activated: Activate | null
  setActivated: Dispatch<SetStateAction<Activate | null>>;
  navBarActive: NavBarOption | null
  setNavBarActive: Dispatch<SetStateAction<NavBarOption | null>>;
  sideBarCollapse: boolean
  setSideBarCollapse: Dispatch<SetStateAction<boolean>>;
}

export interface Activate {
  active: SideBarOption
  trigger: "sideBar" | null
}