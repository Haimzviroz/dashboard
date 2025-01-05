import { Box, Icon, Stack, Typography } from "@mui/material";
import { FC } from "react";
import Battery1 from "../../../assets/battery/battery-1.svg"
import Battery2 from "../../../assets/battery/battery-2.svg"
import Battery3 from "../../../assets/battery/battery-3.svg"
import Battery4 from "../../../assets/battery/battery-4.svg"

interface BatteryCellProps {
  status: number
}

const BatteryCell: FC<BatteryCellProps> = ({ status }) => {

  const isStatusBetween = (value: number, min: number, max: number) => {
    return value > min && value <= max;
  }

  const getBatteryIconByStatus = () => {
    if (isStatusBetween(status, 0, 25)) {
      return <Battery1 />
    } else if (isStatusBetween(status, 26, 50)) {
      return <Battery2 />
    } else if (isStatusBetween(status, 51, 75)) {
      return <Battery3 />
    } else if (isStatusBetween(status, 76, 100)) {
      return <Battery4 />
    } else {
      return null
    }
  }


  return (
    <Box>
      <Stack direction={"row"}>
        <Icon sx={{ mr: .75 }}>
          {getBatteryIconByStatus()}
        </Icon>
        <Typography variant="body1">{status ? `${status}%` : "- - -"}</Typography>
      </Stack>
    </Box>
  );
}

export default BatteryCell;