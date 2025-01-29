import { NextPageWithLayout } from '@/types/types';

import { useReleases } from "@/hooks/releases.query.hook";
import { useGetApp } from "@/providers/getapp.provider";
import { ProjectDto, ReleaseDto } from "@/api/src";
import ReleasesItem from "./releases-item";
import { Box } from "@mui/material";

interface ProjectReleasesProps {
  project: ProjectDto

}

const ProjectReleases: NextPageWithLayout<ProjectReleasesProps> = ({project}) => {
  const { router } = useGetApp()
  const { releases } = useReleases(router.query.projectId as string)

  return (
    <Box my={2}>
      {releases?.map((rel: ReleaseDto) => (
        <ReleasesItem key= {rel.id} release={rel} project={project}></ReleasesItem>
      ))}
    </Box>
  )
}

export default ProjectReleases