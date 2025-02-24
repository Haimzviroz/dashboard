import { Box, Icon, Stack, Typography } from "@mui/material";
import { FC } from "react";
import Windows from "../../../assets/os/brand-windows.svg"
import Linux from "../../../assets/os/brand-linux.svg"
import Android from "../../../assets/os/brand-android.svg"

interface OsCellProps {
  os?: string
}

const OsCell: FC<OsCellProps> = ({ os }) => {


  const getOsIcon = () => {
    switch (os?.toLowerCase()) {
      case "linux":
        return <Linux />
      case "windows":
        return <Windows />
      case "android":
        return <Android />
      default:
        break;
    }
  }
  
  return (
    <Box>
      <Stack direction={"row"}>
        <Icon sx={{ mr: .75 }}>
          {os && getOsIcon()}
        </Icon>
        <Typography variant="body1">{os? os : "- - -"}</Typography>
      </Stack>
    </Box>
  );
}

export default OsCell;