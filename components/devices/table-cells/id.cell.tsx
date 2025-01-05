import { Box, Typography } from "@mui/material";
import { FC, Fragment } from "react";

interface IdCellProps {
  id: string,
  substring?: boolean
}

const IdCell: FC<IdCellProps> = ({ id, substring }) => {
  return (
    <Box sx={{ height: "100%", width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
      {!substring ?
        <Typography variant="body1">{`${id}`}</Typography>
        : <Typography variant="body1">{`${'\u200F#'} ${id.substring(id.length - 4)}`}</Typography>
      }
    </Box>
  );
}

export default IdCell;