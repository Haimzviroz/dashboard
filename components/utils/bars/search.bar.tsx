import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

import Search from "../../../assets/side-bar/search.svg"


interface SearchBarProps {

}

const SearchBar: FC<SearchBarProps> = () => {
  return (
    <TextField
      placeholder="הקלד/י לחיפוש"
      size="small"
      sx={{ bgcolor: "#ECEEF1", borderRadius: 2, p: 1 }}
      variant="standard"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <InputAdornment position="start"><Search /></InputAdornment>)
      }}
    />
  );
}

export default SearchBar;