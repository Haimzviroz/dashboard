import { Typography } from "@mui/material";
import { FC } from "react";

interface NameCellProps {
  name: string
}

const NameCell: FC<NameCellProps> = ({ name }) => {

  return (
    <Typography variant="body1">{name}</Typography>
  )
}

export default NameCell;
