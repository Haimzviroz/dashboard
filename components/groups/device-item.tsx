import { Box, Card, CardContent, Icon, Stack, SxProps, Typography } from "@mui/material"
import { Dispatch, FC, SetStateAction } from "react"
import { Group } from "@/types/interfaces/devices";
import GroupIcon from "../../assets/side-bar/group.svg";
import { DeviceDto } from "@/api/src";

interface GroupItemProps {
  device: DeviceDto,
  // selectedGroup: Group | undefined
  // setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>

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

const DeviceItem: FC<GroupItemProps> = ({ device }) => {

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        my: 1,
        // backgroundColor: selectedGroup?.id === device.id ? '#e0f7fa' : 'white', // Soft teal for active, white for inactive
        cursor: 'pointer',
        // borderColor: selectedGroup?.id === device.id ? '#00acc1' : 'rgba(0, 0, 0, 0.12)', // Accent border color for active
      }}
    >
      <Box >
        {/* <Box onClick={() => setSelectedGroup(device)}> */}
        <CardContent >
          <Stack direction={"row"} gap={1} >
            <Icon>
              <GroupIcon />
            </Icon>
            <Typography>{device.id}</Typography>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}

export default DeviceItem;