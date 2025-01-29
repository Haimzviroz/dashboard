import React, { Fragment, ReactElement, ReactNode } from "react";
import { Typography, Button, Box, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { GetServerSidePropsContext } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import NavBar from "@/components/header/navigation";
import GA_layout from "@/components/layout/GA-layout";
import LTR_MuiProvider from "@/providers/ltr-mui.provider";
import { Q_REGULATIONS } from "@/apis/query-keys";
import RegItem from "@/components/projects/regulations/reg-item";
import {  useRegulations } from "@/hooks/reg.query.hook";
import { useGetApp } from "@/providers/getapp.provider";

const TableOf = (body: ReactNode, header = false) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1.5fr 3fr 1fr .5fr 1fr", // Ensure consistency     
      gap: 3,
      alignItems: "center", // Ensure vertical alignment
      p: 2,
      bgcolor: header ? "#f1f3f5" : "#fff",
      borderBottom: !header ? "1px solid #ddd" : "none",
      fontWeight: header ? "bold" : "normal",
    }}
  >
    {body}
  </Box>
);

const RegHeader = () => (
  <Fragment>
    {["Name", "Description", "Type", "Order", "Actions"].map((text) => (
      <Typography key={text} variant="subtitle2" >
        {text}
      </Typography>
    ))}
  </Fragment>
);


const ProjectRegulations = () => {
  const { router } = useGetApp()
  const { regulations } = useRegulations(router.query.projectId as string)
  
  return (
    <Fragment>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Regulations</Typography>
        <Button variant="contained" startIcon={<Add />}>Add Regulation</Button>
      </Stack>

      <Box sx={{ boxShadow: 2, borderRadius: "10px 10px 0 0" }}>
        {TableOf(<RegHeader />, true)}
        {regulations && regulations.map((regulation) => TableOf(<RegItem key={regulation.name} reg={regulation} />, false))}
      </Box>
    </Fragment>
  )
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
      // await queryClient.prefetchQuery({
      //   queryKey: [Q_TOKENS, projectName],
      //   queryFn: () => httpClient.getProjectTokens(projectName as string),
      // }),
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
      <NavBar projectName={page.props.projectName} />
      <Box sx={{ padding: 4 }}>
        {page}
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}