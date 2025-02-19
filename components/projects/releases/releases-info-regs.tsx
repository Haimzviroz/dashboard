import { Dispatch, FC, Fragment, ReactNode, SetStateAction, useState } from 'react';
import { DetailedReleaseDto, ProjectDto, RegulationDto, RegulationStatusDto, SetReleaseDto } from '@/api/src';
import { Box, Chip, Container, Icon, IconButton, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useReg, useRegsStatus } from '@/hooks/reg.query.hook';
import { stringToColor } from '../regulations/reg-utils';
import { Edit, CheckCircle, Cancel, HelpOutline, ReportProblemOutlined } from "@mui/icons-material";

export const TableOf = (body: ReactNode, header = false, index?: number) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "2.3fr 2.3fr 2.3fr 2.3fr 2.3fr 2.3fr",
      gap: 3,
      alignItems: "center",
      pl: 2,
      py: header ? 2 : 1,
      // pt: header ? 2 : index === 0 ? 0 : 2,
      bgcolor: header ? "#f1f3f5" : "#fff",
      borderTop: !header && index !== 0 ? "1px solid #ddd" : "none",
    }}
  >
    {body}
  </Box>
);

interface RegItemProps {
  project: ProjectDto;
  rel: DetailedReleaseDto;
  reg: RegulationDto;
  regsStatuses: RegulationStatusDto[];
}

const RegItem: FC<RegItemProps> = ({ project, rel, reg, regsStatuses }) => {
  const [regStatus, setRegStatus] = useState<RegulationStatusDto | undefined>(regsStatuses.find(rs => rs.regulation == reg.name))

  return (
    <Fragment>
      {TableOf(
        <Fragment>
          <Typography variant="body1">{reg.displayName ?? reg.name}</Typography>
          <Chip
            size='small'
            label={reg.type.name}
            sx={{
              width: 100,
              ...stringToColor(reg.type.name),
              fontWeight: "bold",
            }}
          />
          <Typography variant="body2">{regStatus?.value}</Typography>
          <Typography variant="body2">{regStatus?.createdAt && new Date(regStatus?.createdAt).toLocaleDateString()}</Typography>
          <Stack direction={"row"} justifyContent={"start"}>
            <Typography variant="body2">
              {regStatus?.isCompliant === true ? (
                <CheckCircle sx={{ color: 'success.main' }} />
              ) : regStatus?.isCompliant === false ? (
                <Cancel sx={{ color: 'error.main' }} />
              ) : (
                <Tooltip title="Status unknown">
                  <HelpOutline sx={{ color: 'grey.500' }} />
                </Tooltip>
              )}
            </Typography>
          </Stack>
          <Stack direction={"row"} justifyContent={"end"}>
            <IconButton size='small' sx={{ color: "#1e88e5" }} >
              <Edit />
            </IconButton>
          </Stack>

        </Fragment>
        , false)}
    </Fragment>
  )
};


interface RelInfoRegsProps {
  project: ProjectDto
  rel: DetailedReleaseDto;
  setRel: Dispatch<SetStateAction<SetReleaseDto>>
}

const RelInfoRegs: FC<RelInfoRegsProps> = ({ project, rel, setRel }) => {
  const { regulations } = useReg(project.name);
  const { regsStatus } = useRegsStatus(project.name, rel.version);

  const RegHeader = () => (
    <Fragment>
      {["Name", "Type", "Status", "Updated", "Is compliant", ""].map((text) => (
        <Typography key={text} variant="subtitle2" fontWeight={"bold"}>
          {text}
        </Typography>
      ))}
    </Fragment>
  );

  if (!regulations || !regsStatus) return <LinearProgress />

  return (
    <Fragment>
      {!!regulations.length
        ?
        <Fragment>
          {TableOf(<RegHeader />, true)}
          {regulations.map((reg) => (
            <Box key={reg.name}>
              <RegItem project={project} rel={rel} reg={reg} regsStatuses={regsStatus} />
            </Box>
          ))}
        </Fragment>
        :
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
          <ReportProblemOutlined sx={{ color: "warning.main" }} />
          <Typography variant="body1" color="text.secondary">
            No regulations defined for this project.
          </Typography>
        </Stack>
      }
    </Fragment>
  );
};

export default RelInfoRegs;
