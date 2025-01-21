import React, { FC, Fragment } from "react";
import {
  Typography,
  Grid,
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
    <Fragment>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <ProjectItem project={project} router={router} key={project.id}/>
        ))}
      </Grid>
    </Fragment>
  );
};

export default ProjectList;
