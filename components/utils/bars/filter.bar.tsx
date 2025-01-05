import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

import Filter from "../../../assets/inputs/filter.svg"


interface SearchBarProps {

}

const SearchBar: FC<SearchBarProps> = () => {
  return (
    <TextField
    placeholder="סוג אמצעי"
    size="small"
    sx={{ borderRadius: 4, width: 120 }}
    variant="outlined"
    InputProps={{
      disableUnderline: true,
      startAdornment: (
        <InputAdornment position="start"><Filter /></InputAdornment>)
    }}
  />
    );
}

export default SearchBar;