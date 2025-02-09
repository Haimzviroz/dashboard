import React, { FC, Fragment, useEffect, useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import ProjectList from "./projects/project-list";
import HeadBar from "./projects/project-headbar";
import { useProjects, useSearchedProjects, useSearchProjects } from "@/hooks/project.query.hook";
import { CreateProjectDtoProjectTypeEnum } from "@/api/src";

interface ProjectsProps {
  projectType: CreateProjectDtoProjectTypeEnum
}

const ProjectsDashboard: FC<ProjectsProps> = ({projectType}) => {

  const [searchTerm, setSearchTerm] = useState<string>("");
  const { projects } = useProjects(projectType)
  const searchedP = useSearchedProjects()
  const searchP = useSearchProjects()

  useEffect(() => {
    if (searchTerm && searchTerm.length > 1) {
      searchP.mutate({ projectName: searchTerm })
    }
  }, [searchTerm])

  const router = useRouter()

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>
      <HeadBar router={router} setSearchTerm={setSearchTerm} projectType={projectType}></HeadBar>
      {searchTerm && searchTerm.length > 1 && searchedP.pSearchResult && searchedP.pSearchResult.length > 0 ?
        <ProjectList title="Search results" projects={searchedP.pSearchResult} router={router} /> :
        <Fragment>
          {projects && <ProjectList title="Pined Projects" projects={projects.filter(p => p.memberContext?.preferences.pinned)} router={router} />}
          {projects && <ProjectList title="All Projects" projects={projects} router={router} />}
        </Fragment>}
    </Box>
  );
};

export default ProjectsDashboard;
