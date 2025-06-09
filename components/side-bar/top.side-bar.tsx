import { FC, Fragment } from "react"
import { ListItemButton, ListItemIcon, ListItemText, SvgIcon } from "@mui/material"

import Apps from "../../assets/side-bar/apps.svg";
import AppsActive from "../../assets/side-bar/apps-active.svg";
import Dashboard from "../../assets/side-bar/dashboard.svg";
import DashboardActive from "../../assets/side-bar/dashboard-active.svg";
import Map from "../../assets/side-bar/map2.svg";
import MapActive from "../../assets/side-bar/map2-active.svg";
import Computer from "../../assets/side-bar/computer.svg";
import ComputerActive from "../../assets/side-bar/computer-active.svg";
import GroupManage from "../../assets/side-bar/group-manage.svg";
import GroupManageActive from "../../assets/side-bar/group-manage-active.svg";


import { AppScopeEnum, SideBarOption } from "@/types/enum";
import { useGetApp } from "@/providers/getapp.provider";
import Router from "next/router";
import { R_APP_DEVICES, R_MAP_DEVICES, R_MAPS, R_PROJECTS, R_APP_GROUP, R_MAP_GROUP } from "@/apis/routes";

interface SideBarItem {
  key: SideBarOption,
  name: string,
  icon: any,
  activeIcon: any,
  isActive?: boolean,
  disabled?: boolean,
  route: string
  scope?: AppScopeEnum
}


const Items: SideBarItem[] = [
  {
    key: SideBarOption.CONTROL,
    name: "לוח הבקרה",
    icon: Dashboard,
    activeIcon: DashboardActive,
    disabled: true,
    route: ""
  },
  {
    key: SideBarOption.APPS,
    name: "אפליקציות",
    icon: Apps,
    activeIcon: AppsActive,
    route: R_PROJECTS,
    scope: AppScopeEnum.getapp
  },
  {
    key: SideBarOption.MAP,
    name: "תשתיות מיפוי",
    icon: Map,
    activeIcon: MapActive,
    isActive: true,
    route: R_MAPS,
    scope: AppScopeEnum.getmap
  },
  {
    key: SideBarOption.DEVICES,
    name: "ניהול אמצעי קצה",
    icon: Computer,
    activeIcon: ComputerActive,
    route: R_APP_DEVICES,
    scope: AppScopeEnum.getapp
  },
  {
    key: SideBarOption.DEVICES,
    name: "ניהול אמצעי קצה",
    icon: Computer,
    activeIcon: ComputerActive,
    route: R_MAP_DEVICES,
    scope: AppScopeEnum.getmap
  },
  {
    key: SideBarOption.GROUPS,
    name: "ניהול קבוצות",
    icon: GroupManage,
    activeIcon: GroupManageActive,
    route: R_APP_GROUP,
    scope: AppScopeEnum.getapp
  },
  {
    key: SideBarOption.GROUPS,
    name: "ניהול קבוצות",
    icon: GroupManage,
    activeIcon: GroupManageActive,
    route: R_MAP_GROUP,
    scope: AppScopeEnum.getmap

  }
]

interface TopBarProps {
  scope: AppScopeEnum
}

const TopBar: FC<TopBarProps> = ({ scope }) => {

  const { activated, sideBarCollapse } = useGetApp()

  const getListItems = () => {
    return Items.filter(i => i.scope === undefined || i.scope === scope).map((item: SideBarItem) => {
      item.isActive = item.key === activated?.active
      return (
        <ListItemButton key={item.key} sx={{ height: 48 }} onClick={() => Router.push(item.route)} disabled={item.disabled} >
          <ListItemIcon  >
            <SvgIcon component={item.isActive ? item.activeIcon : item.icon} />
          </ListItemIcon>
          {sideBarCollapse && <ListItemText primary={item.name} sx={{ color: item.isActive ? "#2979FF" : "#393939" }} />}
        </ListItemButton>
      )
    })
  }

  return (
    <Fragment>
      {getListItems()}
    </Fragment>
  )
}

export default TopBar