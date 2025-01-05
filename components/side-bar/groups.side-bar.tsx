import { FC, Fragment } from "react";
import { SideBarProps } from "./side-bar";
import GroupList from "./group-list";

export interface GroupBarProps {
  groupIdList: number[]
}

const GroupBar: FC<GroupBarProps> = ({ groupIdList }) => {  

  return (
    <Fragment>
      {groupIdList?.map((gId) => <GroupList key={gId} groupId={gId} />)}
    </Fragment >
  )
}

export default GroupBar;