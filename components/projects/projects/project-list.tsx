import React, { FC, Fragment } from "react";
import {
  Typography,
  Grid,
} from "@mui/material";
import { Project } from "@/types/interfaces";
import { NextRouter } from "next/router";
import ProjectItem from "./project-item";

interface ProjectListProps {
  title: string
  projects: Project[]
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
          <ProjectItem project={project} router={router}/>
        ))}
      </Grid>
    </Fragment>
  );
};

export default ProjectList;
