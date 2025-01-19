import React, { FC } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import ProjectList from "./projects/project-list";
import HeadBar from "./projects/project-headbar";
import { useProjects } from "@/hooks/project.query.hook";

interface ProjectsProps {
}

const ProjectsDashboard: FC<ProjectsProps> = () => {

  const { projects } = useProjects()

  const router = useRouter()

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>
      <HeadBar router={router}></HeadBar>
      {projects && <ProjectList title="All Projects" projects={projects} router={router} />}
    </Box>
  );
};

export default ProjectsDashboard;
