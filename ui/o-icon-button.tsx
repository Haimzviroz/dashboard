import { IconButton, IconButtonProps } from "@mui/material";

const O_IconButton: React.FC<IconButtonProps> = (props) => {
  return <IconButton {...props} sx={{ ...props.sx, padding: 0 }} />;
}

export default O_IconButton;
