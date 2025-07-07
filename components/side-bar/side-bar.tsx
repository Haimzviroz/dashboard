import { Drawer, List, ListItem, ListItemIcon, SxProps, Theme } from "@mui/material"
import { FC, Fragment } from "react"

import LeftArrow from "../../assets/side-bar/double-arrow-left.svg";
import RightArrow from "../../assets/side-bar/double-arrow-right.svg";
import O_IconButton from "@/ui/o-icon-button";
import TopBar from "./top.side-bar";
import GroupBarSection from "./group-bar-section";
import { GroupRes } from "@/types/interfaces/devices";
import { AppScopeEnum } from "@/types/enum";
import { useSideBar } from "@/providers/sidebar.provider";


export interface SideBarProps {
  groupList: GroupRes
  withGroups?: boolean;
  scope: AppScopeEnum
}

const SideBar: FC<SideBarProps> = ({ groupList, scope, withGroups }) => {

  const { sideBarCollapse, setSideBarCollapse, } = useSideBar()

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
          <TopBar scope={scope} />
        </List>
        {withGroups && <GroupBarSection
          groupList={groupList}
          sideBarCollapse={sideBarCollapse}
        />}
      </Drawer>

    </Fragment>
  )
}

export default SideBar