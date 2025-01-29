import { Fragment, ReactElement } from "react"
import { GetServerSidePropsContext } from "next/types";

import NavBar from "@/components/header/navigation";

import { NextPageWithLayout } from '@/types/types';

import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import GA_layout from "@/components/layout/GA-layout";
import { Box, Button, Stack, Typography } from "@mui/material";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Q_RELEASE } from "@/apis/query-keys";
import { Edit } from "@mui/icons-material";
import { useReleases } from "@/hooks/releases.query.hook";
import { useGetApp } from "@/providers/getapp.provider";
import { ReleaseDtoStatusEnum } from "@/api/src";
import LTR_MuiProvider from "@/providers/ltr-mui.provider";
import ProjectReleases from "@/components/projects/releases/releases-list";
import { useProject } from "@/hooks/project.query.hook";

interface ProductReleasesProps {
}

const Releases: NextPageWithLayout<ProductReleasesProps> = () => {
  const { router } = useGetApp()
  const { project } = useProject(router.query.projectId as string)

  return (
    <Fragment>
      <Box>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant="h6" gutterBottom>
            Version History
          </Typography>
          <Button variant="contained" color="primary" >
            + New Version
          </Button>
        </Stack>
        {project && <ProjectReleases project={project}></ProjectReleases>}
      </Box>

    </Fragment>
  )
}

export default Releases



export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const params = ctx.params?.projectId
  const queryClient = new QueryClient();

  const httpClient = new SS_ProjectsClient(ctx)

  try {
    await Promise.allSettled([
      await queryClient.prefetchQuery({
        queryKey: [Q_RELEASE, params],
        queryFn: () => httpClient.getProjectReleases(params as string),
      }),
    ])
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

Releases.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <LTR_MuiProvider>
      <Box sx={{ padding: 2 }}>
        <NavBar />
        <Box sx={{ m: 2 }}>
          {page}
        </Box>
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}