import { FC, Fragment } from "react";
import GroupSBList from "./group-list";

export interface GroupBarProps {
  groupIdList: number[]
}

const GroupBar: FC<GroupBarProps> = ({ groupIdList }) => {  

  return (
    <Fragment>
      {groupIdList?.map((gId) => <GroupSBList key={gId} groupId={gId} />)}
    </Fragment >
  )
}

export default GroupBar;