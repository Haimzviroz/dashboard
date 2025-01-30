import React, { Fragment, ReactElement, ReactNode, useState } from "react";
import { Typography, Button, Box, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { GetServerSidePropsContext } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import NavBar from "@/components/header/navigation";
import GA_layout from "@/components/layout/GA-layout";
import LTR_MuiProvider from "@/providers/ltr-mui.provider";
import RegItem from "@/components/projects/regulations/reg-item";
import { useReg } from "@/hooks/reg.query.hook";
import { useGetApp } from "@/providers/getapp.provider";
import RegBetItem from "@/components/projects/regulations/reg-bet-item";
import { Q_PROJECT, Q_REGULATIONS } from "@/apis/query-keys";
import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import RegForm from "@/components/projects/regulations/reg-form";
import { useProject } from "@/hooks/project.query.hook";

export const TableOf = (body: ReactNode, header = false, over = false) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "3fr 6fr 2fr 1fr 2fr",
      gap: 3,
      alignItems: "center",
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
    {["Name", "Description", "Type", "Config", "Actions"].map((text) => (
      <Typography key={text} variant="subtitle2" fontWeight={"bold"}>{text}</Typography>
    ))}
  </Fragment>
);

const ProjectRegulations = () => {
  const { router } = useGetApp()
  const { project } = useProject(router.query.projectId as string)
  const { regulations } = useReg(router.query.projectId as string);
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Regulations</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Regulation</Button>
      </Stack>

      <Box sx={{ boxShadow: 2, borderRadius: "10px 10px 0 0" }}>
        {TableOf(<RegHeader />, true)}
        {project && regulations && regulations.map((regulation) =>
          <Fragment key={JSON.stringify(regulation)}>
            <RegItem reg={regulation} project={project} />
          </Fragment>
        )}
      </Box>
      {project && <RegForm isOpen={open} setIsOpen={setOpen} project={project} />}
    </Fragment>
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
      <NavBar projectName={page.props.projectName} />
      <Box sx={{ padding: 4 }}>
        {page}
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}