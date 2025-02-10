import React, { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react";
import { Typography, Button, Box, Stack, Modal, MenuItem, TextField, FormControlLabel, Checkbox } from "@mui/material";
import { useAddReg, useRegulationsTypes, useUpdateReg } from "@/hooks/reg.query.hook";
import { DetailedProjectDto, DetailedReleaseDto, SetReleaseDto } from "@/api/src";
import { useSetRelease } from "@/hooks/releases.query.hook";
import { CheckBox } from "@mui/icons-material";

import * as Semver from 'semver'
import { useGetApp } from "@/providers/getapp.provider";

interface RelFormProps {
  project: DetailedProjectDto;
  rel?: DetailedReleaseDto;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const RelForm: FC<RelFormProps> = ({ isOpen, setIsOpen, rel, project }) => {

  const { router } = useGetApp()


  const [formData, setFormData] = useState<SetReleaseDto>({
    version: rel?.version ?? "",
    name: rel?.name ?? "",
    releaseNotes: rel?.releaseNotes ?? "",
    metadata: typeof rel?.metadata === 'object' ? rel?.metadata : {},
    dependencies: rel?.dependencies?.map(d => d.id) ?? [],
    isDraft: rel?.status === "draft" || false
  });

  const getNoError = () => ({
    version: "",
  });
  const [errors, setErrors] = useState(getNoError());

  const setRel = useSetRelease()

  const validateForm = () => {
    let newErrors = {
      version: formData.version ? "" : "Version is require"
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "version") {
      if (e.target.value && !Semver.valid(e.target.value)) {
        setErrors({ ...errors, version: "Version in not valid syntax" })
      } else {
        setErrors({ ...errors, version: "" })
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setFormData({
      version: "",
      name: "",
      releaseNotes: "",
      metadata: {},
      dependencies: [],
      isDraft: false
    });
    setErrors(getNoError())
    setIsOpen(false)
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const data = {
      version: formData.version,
      name: formData.name || undefined,
      releaseNotes: formData.releaseNotes || undefined,
      metadata: formData.metadata || undefined,
      dependencies: formData.dependencies || undefined,
      isDraft: formData.isDraft
    }

    setRel.mutate({
      projectName: project.name,
      data
    }, {
      onSuccess: (data: DetailedReleaseDto) => {
        router.push(`${router.asPath}/${data.version}`)
      }
    })

    handleClose()
  };

  const getBody = () => (
    <Fragment>
      <Typography variant="h6">{rel ? `Edit Release ${rel.version}` : `Set New Release`}</Typography>

      <TextField
        label="Version"
        name="version"
        value={formData.version}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={!!errors.version}
        helperText={errors.version}
      />

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <FormControlLabel
        control={
          <Checkbox
            name="isDraft"
            checked={formData.isDraft}
            onChange={handleChange}
          />
        }
        label="Draft"
      />

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {rel ? "Update" : "Create"}
        </Button>
      </Stack>
    </Fragment>
  )

  return (
    <Fragment>
      {rel ?
        <Fragment>
          {getBody()}
        </Fragment>
        : <Modal open={isOpen} onClose={handleClose}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", width: 400,
            bgcolor: "background.paper", boxShadow: 24, p: 4,
            borderRadius: "8px"
          }}>
            {getBody()}
          </Box>
        </Modal>}
    </Fragment>
  );
};

export default RelForm;
