import { Box } from "@mui/material"
import { Dispatch, FC, SetStateAction } from "react"
import NoMaps from "../../assets/maps/no-maps.svg";
import { Group } from "@/types/interfaces/devices"
import GroupItem from "./group-item";

interface GroupListProps {
  groups: Group[],
  selectedGroup: Group | undefined
  setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>
}

const GroupList: FC<GroupListProps> = ({ groups, selectedGroup, setSelectedGroup }) => {

  return (
    <Box>
      <Box sx={{ px: 4 }}>
        {groups.length > 0
          ? groups?.map(group =>
            <GroupItem key={group.id} group={group} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} ></GroupItem>
          )
          : <Box sx={{ textAlign: "center" }}>
            <NoMaps />
            <Box>Empty state</Box>
          </Box>}
      </Box>
    </Box>
  )
}

export default GroupList;