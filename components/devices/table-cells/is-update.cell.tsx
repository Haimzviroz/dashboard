import { Box, Icon, Stack, Typography } from "@mui/material";
import { FC } from "react";
import Check from "../../../assets/is-updated/circle-check-filled.svg"
import ReReq from "../../../assets/is-updated/in-progress.svg"

interface IsUpdateCellProps {
  status: boolean
}

const IsUpdateCell: FC<IsUpdateCellProps> = ({ status }) => {

  const getIsUpdateIconByStatus = () => {
    if (status) {
      return <Check />
    } else {
      return <ReReq />
    }
  }

  return (
    <Box>
      <Stack direction={"row"}>
        <Icon sx={{ mr: .75 }}>
          {getIsUpdateIconByStatus()}
        </Icon>
        <Typography variant="body1"></Typography>
      </Stack>
    </Box>
  );
}

export default IsUpdateCell;