import { Icon, Input, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { FC } from "react";

import SortIcon from "../../../assets/inputs/sort.svg"


interface SortBarProps {
}

const SortBar: FC<SortBarProps> = () => {
  return (
    <TextField
      placeholder="מיון לפי"
      size="small"
      sx={{ borderRadius: 4, width: 120 }}
      variant="outlined"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <InputAdornment position="start"><SortIcon /></InputAdornment>)
      }}
    />
  );
}

export default SortBar;