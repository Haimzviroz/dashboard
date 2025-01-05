import { IconButton, IconButtonProps } from "@mui/material"
import { FC } from "react";

const O_IconButton: React.FC<IconButtonProps> = (props) => {
  return <IconButton {...props} sx={{padding:0}} />;
}

export default O_IconButton;