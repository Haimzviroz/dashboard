import { ExtendButtonBase, IconButton, IconButtonTypeMap } from "@mui/material"

const O_IconButton: ExtendButtonBase<IconButtonTypeMap<{}, "button">> = (props: any) => {
  return <IconButton {...props} sx={{ padding: 0 }} />;
}

export default O_IconButton;