import { FC, Fragment, useEffect, useState } from "react"
import { Collapse, List } from "@mui/material";

import GroupCard from "./group-card";
import { useGroups } from "@/hooks/group.query.hook";
import { Group } from "@/types/interfaces/devices";

interface GroupListProps {
  groupId: number
  marginLeft?: number
}

const GroupSBList: FC<GroupListProps> = ({ groupId, marginLeft = 0 }) => {

  const [currentGroup, setGroup] = useState<Group>();
  const [isCollapse, setIsCollapse] = useState(currentGroup?.isCollapse ?? true);

  const { groups } = useGroups()

  useEffect(() => {
    if (groups && groups.groups) {
      setGroup(groups?.groups[groupId])
    }
  }, [groups])

  const handleOnEnter = () => {
    setGroup(group => {
      if (currentGroup) {
        currentGroup.isCollapse = true
      }
      return group
    })
  }

  const handleOnExit = () => {
    setGroup(group => {
      if (currentGroup) {
        currentGroup.isCollapse = false
      }
      return group
    })
  }

  return (
    <Fragment>
      {currentGroup &&
        <Fragment>
          <List sx={{ paddingTop: .5, paddingBottom: .5, marginLeft }}>
            <GroupCard group={currentGroup} isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
          </List>
          {currentGroup?.groups && isCollapse &&
            <Collapse in={isCollapse} onEnter={() => handleOnEnter()} onExit={() => handleOnExit()} >
              {currentGroup.groups.map((subGroup: number) => <GroupSBList key={subGroup} groupId={subGroup} marginLeft={marginLeft + 2} />)}
            </Collapse>
          }
        </Fragment>
      }
    </Fragment>
  )
}

export default GroupSBList;