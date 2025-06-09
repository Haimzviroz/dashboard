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

// const style: SxProps = {
//   width: 400,
//   maxHeight: "calc(100vh - 100px)",
//   overflowY: "auto",
//   pt: 3,
//   borderRightColor: "#00000020",
//   borderRightStyle: "solid",
//   borderRightWidth: "thin",
//   '&::-webkit-scrollbar': {
//     width: 4,
//   },
//   '&::-webkit-scrollbar-track': {
//     background: "#FFFFFF",
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: '#DBE1EC',
//   },
//   '&::-webkit-scrollbar-thumb:hover': {
//     background: '#9fb1d1'
//   }
// }



const GroupList: FC<GroupListProps> = ({ groups, selectedGroup, setSelectedGroup }) => {

  return (
    <Box>
      {/* <Typography variant="h4" sx={{ fontWeight: 600, px: 3, py: 3 }}>ניהול קבוצות</Typography>

      <Divider /> */}
      <Box sx={{ px: 4 }}>
        {/* <Typography variant="h5" sx={{ fontWeight: 600, pt: 4, mb: 1.5 }}>בחר קבוצה</Typography> */}
        {groups.length > 0
          ? groups?.map(group =>
            <GroupItem key={group.id} group={group} selectedGroup={selectedGroup}  setSelectedGroup={setSelectedGroup} ></GroupItem>
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