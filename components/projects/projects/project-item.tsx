import React, { FC } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Project } from "@/types/interfaces";
import { NextRouter } from "next/router";
import { R_PROJECTS } from "@/apis/routes";
import { NavBarOption } from "@/types/enum";

interface ProjectItemProps {
  project: Project
  router: NextRouter

}

const ProjectItem: FC<ProjectItemProps> = ({ project, router }) => {

  return (
    <Grid item xs={12} md={6} lg={4} key={project.id}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {project.name}
          </Typography>
          <Typography variant="body2" mt={1}>
            <b>Owner:</b> {project.owner}
          </Typography>
          <Typography variant="body2">
            <b>Versions:</b> {project.versions}
          </Typography>
          <Typography variant="body2">
            <b>Teams:</b> {project.numMembers} members
          </Typography>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              router.push(
                R_PROJECTS + "/" + project.name + "/" + NavBarOption.OVERVIEW
              );
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProjectItem;
