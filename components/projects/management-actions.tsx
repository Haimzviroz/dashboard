import React, { FC } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Project } from "@/types/interfaces";
import { useRouter } from "next/router";
import { R_PROJECTS } from "@/apis/routes";
import { NavBarOption } from "@/types/enum";

interface ProjectsProps {
  projects: Project[]
}

const Dashboard: FC<ProjectsProps> = ({ projects }) => {

  const router = useRouter()

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      <Stack
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
        >
          New Project
        </Button>
      </Stack>



      {/* <Typography variant="h6" fontWeight="bold" mb={2}>
        Pinned Projects
      </Typography>
      <Grid container spacing={2} mb={4}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {project.name}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Owner: {project.owner}
                </Typography>
                <Typography variant="body2">Versions: {project.versions}</Typography>
                <Button size="small" variant="outlined" fullWidth sx={{ mt: 2 }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid> */}

      {/* All Projects */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        All Projects
      </Typography>
      <Grid container spacing={2}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {project.name}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Owner: {project.owner}
                </Typography>
                <Typography variant="body2">Versions: {project.versions}</Typography>
                <Typography variant="body2">Teams: {project.members.length} members</Typography>
                <Button size="small" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => { router.push(R_PROJECTS + "/" + project.name + "/" + NavBarOption.OVERVIEW) }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      {/* <Box mt={4}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Recent Activity
        </Typography>
        {[
          { text: "Integration tests completed for Website Redesign v1.2", time: "2 hours ago" },
          { text: "New version 2.1 deployed for Mobile App", time: "4 hours ago" },
          { text: "API Integration v3.0 approved for production", time: "1 day ago" },
        ].map((activity, index) => (
          <Box key={index} mb={2}>
            <Typography variant="body1" fontWeight="bold">
              {activity.text}
            </Typography>
            <Typography variant="caption">{activity.time}</Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Box> */}
    </Box>
  );
};

export default Dashboard;
