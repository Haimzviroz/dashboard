import { Box, Icon, Stack, Typography } from "@mui/material";
import { FC } from "react";
import Import from "../../../assets/map-state/device-desktop-up.svg"
import Push from "../../../assets/map-state/device-pending.svg"
import Delivery from "../../../assets/map-state/device-download.svg"
import Installed from "../../../assets/map-state/device-updated.svg"
import { DeviceMapStateEnum } from "@/types/interfaces";

interface MapStateCellProps {
  state: DeviceMapStateEnum
}

const MapStateCell: FC<MapStateCellProps> = ({ state }) => {

  const getStateDetails = () => {
    switch (state) {
      case DeviceMapStateEnum.IMPORT:
        return { icon: <Import />, text: "בהפקה" }
      case DeviceMapStateEnum.OFFERING:
        return { icon: <Import />, text: "מוצע" }
      case DeviceMapStateEnum.PUSH:
        return { icon: <Push />, text: "בהמתנה" }
      case DeviceMapStateEnum.DELIVERY:
        return { icon: <Delivery />, text: "בהורדה" }
      case DeviceMapStateEnum.INSTALLED:
        return { icon: <Installed />, text: "מותקן" }
    }
  }

  const getStateBody = () => {
    const details = getStateDetails()
    return details && <Stack direction={"row"}>
      <Icon sx={{ mr: .75 }}>
        {details.icon}
      </Icon>
      <Typography variant="body1">{details.text}</Typography>
    </Stack>

  }

  return (
    <Box>
      {getStateBody()}
    </Box>
  );
}

export default MapStateCell;