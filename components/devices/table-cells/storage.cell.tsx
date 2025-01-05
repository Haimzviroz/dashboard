import { Box, Icon, Stack, Typography } from "@mui/material";
import { FC } from "react";

interface StorageCellProps {
  status: number,
  type: "MB" | "GB"
}

const StorageCell: FC<StorageCellProps> = ({ status, type }) => {
  const convertBytesToGigabytes = () => {
    return status / 1000 / 1000 / 1000
  }

  const convertBytesToMegabytes = () => {
    return status / 1000 / 1000
  }

  const getFormatToDisplay = () => {
    let status: number;
    switch (type) {
      case "GB":
        status = convertBytesToGigabytes()
        break;
      case "MB":
        status = convertBytesToMegabytes()
        break;
    }
    if (status) {
      if (status >= 1) {
        return `${status.toFixed()}${type}`;
      } else {
        return `${status.toFixed(2)}${type}`; // Adjust '2' to specify the number of decimal places
      }
    } else {
      return "- - -"
    }
  }

  return (
    <Box>
      <Typography variant="body1">{getFormatToDisplay()}</Typography>
    </Box>
  );
}

export default StorageCell;