import { Divider, Drawer, List, ListItem, ListItemIcon, SxProps, Theme } from "@mui/material"
import { FC, Fragment, useState } from "react"

import LeftArrow from "../../assets/side-bar/double-arrow-left.svg";
import RightArrow from "../../assets/side-bar/double-arrow-right.svg";
import O_IconButton from "@/ui/o-icon-button";
import TopBar from "./top.side-bar";
import GroupBar from "./groups.side-bar";
import SearchBar from "./search.side-bar";
import { useGetApp } from "@/providers/getapp.provider";
import { GroupRes } from "@/types/interfaces/devices";
import { AppScopeEnum } from "@/types/enum";


export interface SideBarProps {
  groupList: GroupRes
  scope: AppScopeEnum
}

const SideBar: FC<SideBarProps> = ({ groupList, scope }) => {

  const { sideBarCollapse, setSideBarCollapse, } = useGetApp()

  const style: SxProps<Theme> = (theme) => ({
    border: 'none',
    width: sideBarCollapse ? "288px" : "55px",
    position: "unset",
    overflow: "hidden",
    ml: 4,
    pl: 1,
    pr: 3,
    backgroundColor: "inherit",

    [theme.breakpoints.down("xl")]: {
      width: sideBarCollapse ? "200px" : "55px",
    }
  });



  return (
    <Fragment>
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{ sx: style }}
      >
        <List >
          <ListItem sx={{ height: 48 }} >
            <ListItemIcon>
              <O_IconButton onClick={() => { setSideBarCollapse(!sideBarCollapse) }}>
                {sideBarCollapse ? <RightArrow /> : <LeftArrow />}
              </O_IconButton>
            </ListItemIcon>
          </ListItem>
          <TopBar scope= {scope} />
        </List>
        {/* {sideBarCollapse && <SearchBar />} */}
        {sideBarCollapse && groupList && <GroupBar groupIdList={groupList.roots} />}
      </Drawer>

    </Fragment>
  )
}

export default SideBar