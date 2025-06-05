import { Dispatch, FC, Fragment, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { DetailedReleaseDto, ProjectDto, RegulationDto, RegulationStatusDto, SetReleaseDto } from '@/api/src';
import { Box, Checkbox, Chip, IconButton, LinearProgress, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useReg, useRegsStatus, useSetRegsStatus } from '@/hooks/reg.query.hook';
import { stringToColor } from '../regulations/reg-utils';
import { Edit, CheckCircle, Cancel, CancelOutlined, HelpOutline, ReportProblemOutlined, Save } from "@mui/icons-material";
import UploadFile from '../files/upload-file';

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
  const [regStatus,setRegStatus] = useState<RegulationStatusDto | undefined>(regsStatuses.find(rs => rs.regulation == reg.name))
  const [value, setValue] = useState<string | undefined>(regStatus?.value)
  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    const regStatus = regsStatuses.find(rs => rs.regulation == reg.name)
    setRegStatus(regStatus)
    setValue(regStatus?.value)
  }, [regsStatuses])

  const setReg = useSetRegsStatus()

  const boolReg = () => {
    return <Checkbox
      onChange={(e) => setValue(e.target.checked.toString())}
      checked={value === "true"}
      indeterminate={!editMode && regStatus?.isCompliant === undefined}
      disabled={!editMode}
      sx={{
        p: 0,
        "&.MuiCheckbox-indeterminate": {
          color: "gray",
        },
        "&.Mui-disabled": {
          color: regStatus?.isCompliant === undefined ? undefined : "#1976d2"
        },
      }}
    />
  }

  const thresholdReg = () => {
    return (editMode
      ? <TextField
        value={value}
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
        size={"small"}
        type="number"
        inputProps={{
          min: 1,
          max: 100,
        }}
      />
      : <Typography variant="body2">{regStatus?.value}</Typography>
    )
  }

  const jUnitReg = () => {
    return (editMode
      ? <Fragment></Fragment>
      : <Typography variant="body2">{regStatus?.value}</Typography>
    )
  }

  const getValueBody = () => {
    switch (reg.type.name) {
      case "JUnit":
        return jUnitReg()
      case "Threshold":
        return thresholdReg()
      case "Boolean":
        return boolReg()
      default:
        return <Fragment></Fragment>
    }
  }

  const onSuccessUploadJUnit = (data?: number) => {
    handleSave(data)
    setEditMode(false)
  }

  const handleClose = () => {
    setEditMode(false)
  }

  const handleSave = (val?: number) => {
    if (val ?? value) {
      setReg.mutate({
        projectName: project.name,
        version: rel.version,
        regulation: reg.name,
        data: { value: val?.toString() ?? value ?? "" }
      })
      setEditMode(false)
    }
  }

  return (
    <Fragment>
      {TableOf(
        <Fragment>
          <Typography variant="body1">{reg.displayName || reg.name}</Typography>
          <Chip
            size='small'
            label={reg.type.name}
            sx={{
              width: 80,
              ...stringToColor(reg.type.name),
              fontWeight: "bold",
            }}
          />
          <Stack direction={"row"} justifyContent={"start"}>
            {getValueBody()}
          </Stack>
          <Typography variant="body2">{regStatus?.createdAt ? new Date(regStatus?.createdAt).toLocaleDateString() : "- - -"}</Typography>
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
          {editMode
            ? <Stack direction={"row"} justifyContent={"end"}>
              <IconButton sx={{ p: .25 }} onClick={handleClose}>
                <CancelOutlined fontSize="small" color="error" />
              </IconButton>
              <IconButton sx={{ p: .25 }} onClick={() => handleSave()}>
                <Save fontSize="small" color='success' />
              </IconButton>
            </Stack>
            : <Stack direction={"row"} justifyContent={"end"}>
              <IconButton size='small' sx={{ color: "#1e88e5" }} onClick={() => setEditMode(true)}>
                <Edit />
              </IconButton>
            </Stack>
          }

        </Fragment>
        , false)}
      {reg.type.name === "JUnit" && editMode &&
        <UploadFile project={project} rel={rel} deployable={false} onSuccess={onSuccessUploadJUnit} />}
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
