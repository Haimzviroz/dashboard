import React, { ReactElement } from "react";
import { Box } from "@mui/material";
import ProNavBar from "@/components/header/project-nav";
import GA_layout from "@/components/layout/GA-layout";
import LTR_MuiProvider from "@/providers/ltr-mui.provider";
import { Q_PROJECT, Q_REGULATIONS } from "@/apis/query-keys";
import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Regulations from "@/components/projects/regulations/regulations";

const ProjectRegulations = () => {
  return (
    <Regulations />
  );
};

export default ProjectRegulations;


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const projectName = ctx.params?.projectId
  const queryClient = new QueryClient();

  const httpClient = new SS_ProjectsClient(ctx)

  try {
    await Promise.allSettled([
      await queryClient.prefetchQuery({
        queryKey: [Q_REGULATIONS, projectName],
        queryFn: () => httpClient.getProjectRegulations(projectName as string),
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_PROJECT, projectName],
        queryFn: () => httpClient.getProjectByName(projectName as string),
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

ProjectRegulations.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <LTR_MuiProvider>
      <ProNavBar projectName={page.props.projectName} />
      <Box sx={{ padding: 4 }}>
        <DndProvider backend={HTML5Backend}>
          {page}
        </DndProvider>
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}