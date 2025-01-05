import { Box, Icon, Stack, Typography } from "@mui/material";
import { FC } from "react";
import Import from "../../../assets/map-state/device-desktop-up.svg"
import Push from "../../../assets/map-state/device-pending.svg"
import Delivery from "../../../assets/map-state/device-download.svg"
import Installed from "../../../assets/map-state/device-updated.svg"
import { DeviceSoftwareStateEnum } from "@/types/interfaces/getapp";

interface MapStateCellProps {
  state: DeviceSoftwareStateEnum
}

const MapStateCell: FC<MapStateCellProps> = ({ state }) => {

  const getStateDetails = () => {
    switch (state) {
      case DeviceSoftwareStateEnum.OFFERING:
        return { icon: <Import />, text: "מוצע" }
      case DeviceSoftwareStateEnum.PUSH:
        return { icon: <Push />, text: "בהמתנה" }
      case DeviceSoftwareStateEnum.DELIVERY:
        return { icon: <Delivery />, text: "בהורדה" }
      case DeviceSoftwareStateEnum.INSTALLED:
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