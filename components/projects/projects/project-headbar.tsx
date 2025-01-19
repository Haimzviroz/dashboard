import React, { Dispatch, FC, SetStateAction } from "react";
import {
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { NextRouter } from "next/router";
import { R_PROJECTS_NEW } from "@/apis/routes";
import { UseMutateFunction } from "@tanstack/react-query";
import { Project } from "@/types/interfaces";

interface HeadBarProps {
  router: NextRouter
  onSearch: UseMutateFunction<Project[], Error, { projectName: string; }, unknown>
  setSearchTerm: Dispatch<SetStateAction<string>>
}

const HeadBar: FC<HeadBarProps> = ({ router, onSearch, setSearchTerm }) => {

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value && value.length > 1) {
      setSearchTerm(value)
    } else {
      setSearchTerm("")
    }
  }

  return <Stack
    direction={{ xs: 'column', sm: 'row' }} // Stack direction changes based on screen size
    gap={2}
    mb={2}
    sx={{ width: '100%' }} // Ensures it takes full width
  >
    <TextField
      fullWidth
      placeholder="Search projects..."
      variant="outlined"
      InputProps={{
        sx: { height: 40 },
        startAdornment: (
          <InputAdornment position="start">
            <IconButton edge="start">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    <Button
      variant="contained"
      sx={{
        width: { xs: '100%', sm: '20%', md: "30%", lg: "20%" }, // Full width on small screens, 20% on larger screens
        height: 40, // Ensure button height is consistent with the input field
        fontSize: { xs: '10px', sm: '10px', md: "14px" }, // Responsive font size
      }}
      onClick={() => router.push(R_PROJECTS_NEW)}
    >
      New Project
    </Button>
  </Stack>
}

export default HeadBar