import React, { Fragment, useState } from "react";
import { Typography, Button, Box, Stack } from "@mui/material";
import { Add, ReportProblemOutlined } from "@mui/icons-material";

import { RegulationDto } from "@/api/src";
import { useReg, useSetRegOrder } from "@/hooks/reg.query.hook";
import { useProject } from "@/hooks/project.query.hook";
import { useGetApp } from "@/providers/getapp.provider";

import { TableOf } from "./reg-utils";
import RegBetItem from "@/components/projects/regulations/reg-bet-item";
import RegItem from "@/components/projects/regulations/reg-item";
import RegForm from "@/components/projects/regulations/reg-form";



const Regulations = () => {
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

  const RegHeader = () => (
    <Fragment>
      {["", "Name", "Description", "Type", "Config", "Actions"].map((text) => (
        <Typography key={text} variant="subtitle2" fontWeight={"bold"}>{text}</Typography>
      ))}
    </Fragment>
  );

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
        {project && regulations && (
          !!regulations.length
            ? regulations.sort(sortRegs).map((regulation, index) =>
              <Fragment key={JSON.stringify(regulation)}>
                {index == 0 && <RegBetItem reg={regulation} index={index - 1} moveOrder={moveRegOrder} />}
                <RegItem key={JSON.stringify(regulation)} reg={regulation} project={project} index={index} />
                <RegBetItem reg={regulation} index={index} moveOrder={moveRegOrder} />
              </Fragment>
            )
            : <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
              <ReportProblemOutlined sx={{ color: "warning.main" }} />
              <Typography variant="body1" color="text.secondary">
                No regulations defined for this project.
              </Typography>
            </Stack>)}
      </Box>
      {project && <RegForm isOpen={open} setIsOpen={setOpen} project={project} />}
    </Fragment>
  );
};

export default Regulations;