import { Box, Typography } from "@mui/material";
import { FC, Fragment } from "react";

interface TextCellProps {
  text: string
}

const TextCell: FC<TextCellProps> = ({ text }) => {
  return (
    <Box >
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
}

export default TextCell;