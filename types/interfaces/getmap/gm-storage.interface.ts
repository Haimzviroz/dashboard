import { SideBarOption } from "@/types/enum";
import { Dispatch, SetStateAction } from "react";
import { Map, productMap } from '@/types/interfaces';
import { Group } from "../devices";
import { NextRouter } from "next/router";

export interface GetAppProviderProps {
  // groups: Group[],
  // setGroups: Dispatch<SetStateAction<Group[]>>,
  router: NextRouter
  selectedGroup: number[],
  setSelectedGroup: Dispatch<SetStateAction<number[]>>,
  setGroupInSelectedGroup: (group: Group) => void,
  // selectedMap: Map | null,
  // setSelectedMap: Dispatch<SetStateAction<Map | null>>,
  // productMap: { [key: string]: productMap } | null,
  // setProductMap: Dispatch<SetStateAction<{ [key: string]: productMap } | null>>,
  // currentProduct: productMap | null | undefined,
  // setCurrentProduct: Dispatch<SetStateAction<productMap | null | undefined>>,
  activated: Activate | null
  setActivated: Dispatch<SetStateAction<Activate | null>>;
  sideBarCollapse: boolean
  setSideBarCollapse: Dispatch<SetStateAction<boolean>>;
}

export interface Activate {
  active: SideBarOption
  trigger: "sideBar" | null
}