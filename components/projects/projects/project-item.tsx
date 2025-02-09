import React, { FC, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { NextRouter } from "next/router";
import { R_PROJECTS } from "@/apis/routes";
import { ProNavBarOption } from "@/types/enum";
import { ProjectDto } from "@/api/src";
import { usePinProject } from "@/hooks/project-member.query.hook";

interface ProjectItemProps {
  project: ProjectDto;
  router: NextRouter;
}

const ProjectItem: FC<ProjectItemProps> = ({ project, router }) => {
  
  const [isPined, setIsPined] = useState(project.memberContext?.preferences.pinned);
  const pinProject = usePinProject()

  const toggleImportant = () => {
    setIsPined(!isPined)
    pinProject.mutate({ projectName: project.name, data: { pinned: !isPined } })
  };

  return (
    <Grid item xs={12} md={6} lg={4} key={project.id}>
      <Card variant="outlined">
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              {project.name}
            </Typography>
            <IconButton onClick={toggleImportant} aria-label="mark as important">
              {isPined ? <Star color="warning" /> : <StarBorder color="warning" />}
            </IconButton>
          </div>
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
                R_PROJECTS + "/" + project.name + "/" + ProNavBarOption.OVERVIEW
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
