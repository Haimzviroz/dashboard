import { Box, Icon, Stack, Typography } from "@mui/material";
import { FC } from "react";
import Signal0 from "../../../assets/power/cell-signal-0.svg"
import Signal1 from "../../../assets/power/cell-signal-1.svg"
import Signal2 from "../../../assets/power/cell-signal-2.svg"
import Signal3 from "../../../assets/power/cell-signal-3.svg"

interface BandwidthCellProps {
  status: number
}

const BandwidthCell: FC<BandwidthCellProps> = ({ status }) => {

  const isStatusBetween = (value: number, min: number, max?: number) => {
    return value >= min && value <= (max ?? Number.MAX_VALUE);
  }

  const getPowerIconByStatus = () => {
    // if (isStatusBetween(status, -1, 0)) {
    //   return { icon: <Signal0 />, text: "ללא חיבור" }
    if (isStatusBetween(status, 0, 3)) {
      return { icon: <Signal1 />, text: "עוצמה חלשה" }
    } else if (isStatusBetween(status, 4, 10)) {
      return { icon: <Signal2 />, text: "עוצמה נמוכה" }
    } else if (isStatusBetween(status, 11)) {
      return { icon: <Signal3 />, text: "עוצמה גבוהה" }
    } else {
      return { icon: null, text: "- - -" }
    }
  }

  const getPowerBody = () => {
    const details = getPowerIconByStatus()
    return <Stack direction={"row"}>
      <Icon sx={{ mr: .75 }}>
        {details.icon}
      </Icon>
      <Typography variant="body1">{details.text}</Typography>
    </Stack>

  }


  return (
    <Box>
      {getPowerBody()}
    </Box>
  );
}

export default BandwidthCell;