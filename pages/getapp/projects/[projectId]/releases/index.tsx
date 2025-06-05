import { Fragment, ReactElement, useState } from "react"
import { GetServerSidePropsContext } from "next/types";

import ProNavBar from "@/components/header/project-nav";

import { NextPageWithLayout } from '@/types/types';

import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import GA_layout from "@/components/layout/GA-layout";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Q_RELEASES } from "@/apis/query-keys";
import { useGetApp } from "@/providers/getapp.provider";
import LTR_MuiProvider from "@/providers/ltr-mui.provider";
import ProjectReleases from "@/components/projects/releases/releases-list";
import { useProject } from "@/hooks/project.query.hook";
import RelForm from "@/components/projects/releases/release-form";
import React from "react";

interface ProductReleasesProps {
}

const Releases: NextPageWithLayout<ProductReleasesProps> = () => {
  const { router } = useGetApp()
  const { project } = useProject(router.query.projectId as string)
  const [open, setOpen] = useState(false);


  return (
    <Container>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">Version History</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            + New Version
          </Button>
        </Stack>
        {project && <ProjectReleases project={project}></ProjectReleases>}
        {project && <RelForm isOpen={open} setIsOpen={setOpen} project={project} />}
      </Box>

    </Container>
  )
}

export default Releases



export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const projectName = ctx.params?.projectId
  const queryClient = new QueryClient();

  const httpClient = new SS_ProjectsClient(ctx)

  try {
    await Promise.allSettled([
      await queryClient.fetchQuery({
        queryKey: [Q_RELEASES, projectName],
        queryFn: () => httpClient.getProjectReleases(projectName as string),
      }),
    ])
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        projectName
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

Releases.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <LTR_MuiProvider>
      <ProNavBar projectName={page.props.projectName} />
      <Box sx={{ padding: 4 }}>
        {page}
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}