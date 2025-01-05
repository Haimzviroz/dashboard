import { TextField, InputAdornment } from "@mui/material";

import Search from "../../assets/side-bar/search.svg";

const SearchBar = () => {
  return (
    <TextField
      placeholder="הקלד/י לחיפוש"
      size="small"
      sx={{ mb: 5, mt: 3, p: 1, bgcolor: "#ECEEF1", borderRadius: 2 }}
      variant="standard"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <InputAdornment position="start"><Search /></InputAdornment>)
      }}
    ></TextField>
  )
}

export default SearchBar;