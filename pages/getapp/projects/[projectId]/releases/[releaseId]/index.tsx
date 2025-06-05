import { Fragment, ReactElement } from "react"
import { GetServerSidePropsContext } from "next/types";

import ProNavBar from "@/components/header/project-nav";

import { NextPageWithLayout } from '@/types/types';

import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import GA_layout from "@/components/layout/GA-layout";
import { Box, Container } from "@mui/material";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Q_PROJECT, Q_RELEASE } from "@/apis/query-keys";
import { useRelease } from "@/hooks/releases.query.hook";
import { useGetApp } from "@/providers/getapp.provider";
import LTR_MuiProvider from "@/providers/ltr-mui.provider";
import { useProject } from "@/hooks/project.query.hook";
import ReleasesInfo from "@/components/projects/releases/releases-info";

interface DetailedReleaseProps {
}

const DetailedRelease: NextPageWithLayout<DetailedReleaseProps> = () => {
  const { router } = useGetApp()
  const { project } = useProject(router.query.projectId as string)
  const { release } = useRelease(router.query.projectId as string, router.query.releaseId as string)


  return (
    <Container>
      {project && release && <ReleasesInfo project={project} release={release} />}
    </Container>
  )
}

export default DetailedRelease



export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const projectName = ctx.params?.projectId
  const releaseVersion = ctx.params?.releaseId
  const queryClient = new QueryClient();


  const httpClient = new SS_ProjectsClient(ctx)

  try {
    await Promise.allSettled([
      await queryClient.fetchQuery({
        queryKey: [Q_PROJECT, projectName],
        queryFn: () => httpClient.getProjectByName(projectName as string),
      }),
      await queryClient.fetchQuery({
        queryKey: [Q_RELEASE, releaseVersion],
        queryFn: () => httpClient.getDetailedRelease(projectName as string, releaseVersion as string),
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

DetailedRelease.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <LTR_MuiProvider>
      <ProNavBar projectName={page.props.projectName} />
      <Box sx={{ padding: 4 }}>
        {page}
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}