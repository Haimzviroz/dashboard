import React, { Fragment, ReactElement, ReactNode, useEffect, useState } from "react";
import { Typography, Button, Box, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import NavBar from "@/components/header/navigation";
import GA_layout from "@/components/layout/GA-layout";
import LTR_MuiProvider from "@/providers/ltr-mui.provider";
import RegItem from "@/components/projects/regulations/reg-item";
import { useReg, useSetRegOrder } from "@/hooks/reg.query.hook";
import { useGetApp } from "@/providers/getapp.provider";
import RegBetItem from "@/components/projects/regulations/reg-bet-item";
import { Q_PROJECT, Q_REGULATIONS } from "@/apis/query-keys";
import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import RegForm from "@/components/projects/regulations/reg-form";
import { useProject } from "@/hooks/project.query.hook";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RegulationDto } from "@/api/src";

export const ItemType = 'REGULATION';

export const TableOf = (body: ReactNode, header = false, index?: number) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: ".5fr 2fr 6fr 2fr 1fr 2fr",
      gap: 3,
      alignItems: "center",
      pr: 2,
      pb: header ? 2 : 0,
      pt: header ? 2 : index === 0 ? 0 : 2,
      bgcolor: header ? "#f1f3f5" : "#fff",
      borderTop: !header && index !== 0 ? "1px solid #ddd" : "none",
    }}
  >
    {body}
  </Box>
);

const RegHeader = () => (
  <Fragment>
    {["", "Name", "Description", "Type", "Config", "Actions"].map((text) => (
      <Typography key={text} variant="subtitle2" fontWeight={"bold"}>{text}</Typography>
    ))}
  </Fragment>
);

const ProjectRegulations = () => {
  const { router } = useGetApp()
  const { project } = useProject(router.query.projectId as string)
  const { regulations, refetch } = useReg(router.query.projectId as string);
  const setRegsOrder = useSetRegOrder()
  const [open, setOpen] = useState(false);

  const sortRegs = (a: RegulationDto, b: RegulationDto) => {
    if (a.order === 0 && b.order === 0) return 0;
    if (a.order === 0) return 1; // Move 0 to the end
    if (b.order === 0) return -1; // Move 0 to the end
    return a.order - b.order;
  }

  const moveRegOrder = (itemIndex: number, item: RegulationDto) => {
    if (!regulations || !project) return;

    const regs = [...regulations]
      .filter(r => r.name !== item.name)
      .sort(sortRegs);

    regs.splice(itemIndex, 0, item);

    regs.forEach((reg, index) => {
      reg.order = index + 1;
    });

    setRegsOrder.mutate({
      projectName: project.name,
      regs
    }, {
      onSuccess: () => refetch()
    });
  };

  return (
    <Fragment>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Regulations</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Regulation</Button>
      </Stack>

      <Box sx={{ boxShadow: 2, borderRadius: "10px 10px 0 0" }}>
        {TableOf(<RegHeader />, true)}
        {project && regulations && regulations.sort(sortRegs).map((regulation, index) =>
          <Fragment key={JSON.stringify(regulation)}>
            {index == 0 && <RegBetItem reg={regulation} index={index - 1} moveOrder={moveRegOrder} />}
            <RegItem key={JSON.stringify(regulation)} reg={regulation} project={project} index={index} />
            <RegBetItem reg={regulation} index={index} moveOrder={moveRegOrder} />
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
        <DndProvider backend={HTML5Backend}>
          {page}
        </DndProvider>
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}