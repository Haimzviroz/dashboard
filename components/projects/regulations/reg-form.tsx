import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Typography, Button, Box, Stack, Modal, MenuItem, TextField } from "@mui/material";
import { useAddReg, useRegulationsTypes, useUpdateReg } from "@/hooks/reg.query.hook";
import { DetailedProjectDto, RegulationDto } from "@/api/src";

interface RegFormProps {
  project: DetailedProjectDto;
  reg?: RegulationDto;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const RegForm: FC<RegFormProps> = ({ isOpen, setIsOpen, reg, project }) => {

  const [formData, setFormData] = useState({
    name: reg?.name ?? "",
    displayName: reg?.displayName ?? "",
    description: reg?.description ?? "",
    type: reg?.type ?? undefined,
    config: reg?.config ?? 0,
  });

  const getNoError = () => ({
    name: "",
    type: "",
    config: ""
  })
  const [errors, setErrors] = useState(getNoError());

  const { regTypes = [] } = useRegulationsTypes();
  const addReg = useAddReg()
  const updateReg = useUpdateReg()


  const validateForm = () => {
    let newErrors = {
      name: formData.name.trim() ? "" : "Name is required",
      type: formData.type ? "" : "Type is required",
      config: formData.type?.name !== "Boolean" ? formData.config ? "" : "Configuration is required" : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const getTypeById = (id: number) => {
    return regTypes.find(t => t.id === id)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ ...errors, [e.target.name]: "" })
    if (e.target.name === "type") {
      setFormData({ ...formData, [e.target.name]: getTypeById(Number(e.target.value)) })
    } else if (e.target.name === "name") {
      setFormData({ ...formData, [e.target.name]: e.target.value.split(" ").join("_") });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      displayName: "",
      description: "",
      type: undefined,
      config: ""
    });
    setErrors(getNoError())
    setIsOpen(false)
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (formData.type) {
      const data = {
        name: formData.name,
        typeId: formData.type.id,
        description: formData.description,
        config: formData.config.toString(),
        displayName: formData.displayName
      }
      if (reg) {
        updateReg.mutate({
          projectName: project.name,
          regId: reg.name,
          data
        })
      } else {
        addReg.mutate({
          projectName: project.name,
          data
        })
      }
      handleClose()
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: 400,
        bgcolor: "background.paper", boxShadow: 24, p: 4,
        borderRadius: "8px"
      }}>
        <Typography variant="h6">{reg ? "Edit Regulation" : "Create New Regulation"}</Typography>

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Display Name"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <TextField
          select
          label="Type"
          name="type"
          value={formData.type?.id}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={!!errors.type}
          helperText={errors.type}
        >
          {regTypes.map((t) => (
            <MenuItem key={t.id} value={t.id} sx={{ width: "100%", maxWidth: 400, display: "block" }}>
              <Stack direction="column" spacing={0.5}>
                <Typography variant="body1">{t.name}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {t.description}
                </Typography>
              </Stack>
            </MenuItem>
          ))}

        </TextField>

        {/* <TextField
          label="Order"
          name="order"
          type="number"
          value={formData.order}
          onChange={handleChange}
          fullWidth
          margin="normal"
        /> */}

        {formData.type && formData.type.name !== "Boolean" && <TextField
          type="number"
          label="Configuration"
          name="config"
          value={formData.config}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          placeholder="bool / number"
          error={!!errors.config}
          helperText={errors.config}
          inputProps={{
            min: 1,
            max: 100,
          }}
        />}

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {reg ? "Update" : "Create"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RegForm;
