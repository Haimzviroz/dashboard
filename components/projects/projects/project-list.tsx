import React, { FC, Fragment, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { NextRouter } from "next/router";
import ProjectItem from "./project-item";
import { ProjectDto } from "@/api/src";

interface ProjectListProps {
  title: string
  projects: ProjectDto[]
  router: NextRouter
}

const ProjectList: FC<ProjectListProps> = ({ title, projects, router }) => {

  return (
    <Box mt={2}>
      {projects.length > 0 && <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>}
      <Grid container spacing={2}>
        {projects.map((project) => (
          <ProjectItem project={project} router={router} key={project.id.toString() + project.memberContext?.preferences.pinned} />
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectList;
