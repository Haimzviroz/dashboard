import { Box, Card, CardContent, Icon, Stack, Typography } from "@mui/material"
import { FC } from "react"
import DeviceIcon from "../../assets/devices/device.svg";
import { DeviceDto } from "@/api/src";


interface DvcItemMngProps {
  device: DeviceDto,
}

const DvcItemMng: FC<DvcItemMngProps> = ({ device }) => {

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        my: 1,
        minWidth: 200
      }}
    >
      <Box>
        <CardContent >
          <Stack direction={"row"} gap={1} >
            <Icon>
              <DeviceIcon />
            </Icon>
            <Typography>{device.name ? device.name : device.id.substring(device.id.length - 4)}</Typography>
          </Stack>
        </CardContent>
      </Box>
    </Card >
  )
}

export default DvcItemMng;