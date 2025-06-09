import { Box, Card, CardContent, Icon, Stack, SxProps, Typography } from "@mui/material"
import { Dispatch, FC, SetStateAction } from "react"
import { Group } from "@/types/interfaces/devices";
import GroupIcon from "../../assets/side-bar/group.svg";

interface GroupItemProps {
  group: Group,
  selectedGroup: Group | undefined
  setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>

}
const boxStyle: SxProps = {
  border: 1,
  borderColor: "#DBE1EC",
  borderRadius: 2,
  my: 1,
  padding: 2,
  marginRight: .5,
  width: 300,
  cursor: "pointer"
}

const GroupItem: FC<GroupItemProps> = ({ group, selectedGroup, setSelectedGroup }) => {

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        my: 1,
        backgroundColor: selectedGroup?.id === group.id ? '#e0f7fa' : 'white', // Soft teal for active, white for inactive
        cursor: 'pointer',
        borderColor: selectedGroup?.id === group.id ? '#00acc1' : 'rgba(0, 0, 0, 0.12)', // Accent border color for active
      }}
    >
      <Box onClick={() => setSelectedGroup(group)}>
        <CardContent >
          <Stack direction={"row"} gap={1} >
            <Icon>
              <GroupIcon />
            </Icon>
            <Typography>{group.name}</Typography>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}

export default GroupItem;