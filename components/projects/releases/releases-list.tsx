import { NextPageWithLayout } from '@/types/types';

import { useReleases } from "@/hooks/releases.query.hook";
import { useGetApp } from "@/providers/getapp.provider";
import { ReleaseDto } from "@/api/src";
import ReleasesItem from "./releases-item";
import { Box } from "@mui/material";

interface ProjectReleasesProps {
}

const ProjectReleases: NextPageWithLayout<ProjectReleasesProps> = () => {
  const { router } = useGetApp()
  const { releases } = useReleases(router.query.projectId as string)

  return (
    <Box my={2}>
      {releases?.map((rel: ReleaseDto) => (
        <ReleasesItem release={rel}></ReleasesItem>
      ))}
    </Box>
  )
}

export default ProjectReleases