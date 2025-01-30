import React, { FC, Fragment, useRef, useState } from "react";
import { Typography, IconButton, Chip, Stack, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { DetailedProjectDto, RegulationDto } from "@/api/src";
import { TableOf } from "@/pages/getapp/projects/[projectId]/regulations";

import RegForm from "./reg-form";

import { useDeleteReg } from "@/hooks/reg.query.hook";

interface DeleteConfirmationDialogProps {
  open: boolean;
  projectName: string;
  regName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  projectName,
  regName,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to remove <strong>{regName}</strong> from <strong>{projectName}</strong>?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);


interface RegItemProps {
  project: DetailedProjectDto;
  reg: RegulationDto
}

const RegItem: FC<RegItemProps> = ({ reg, project }) => {

  const [openEditReg, setOpenEditReg] = useState(false);
  const [confirmDeleteToggle, setConfirmDeleteToggle] = useState<boolean>(false);

  const delReg = useDeleteReg()

const RegItem: FC<RegItemProps> = ({ reg }) => {

  const handleDelete = () => {
    delReg.mutate({
      projectName: project.name,
      regId: reg.name
    })
  }

  return (
    <Fragment>

      <Box>
        {TableOf(
          <Fragment>
            <Typography variant="body1">{reg.displayName ?? reg.name}</Typography>
            <Typography variant="body2" color="textSecondary">{reg.description}</Typography>
            <Chip
              label={reg.type.name}
              sx={{
                width: 100,
                // backgroundColor: reg.type === "Type 1" ? "#d1fae5" : "#e0e7ff",
                // color: reg.type === "Type 1" ? "#065f46" : "#3730a3",
                fontWeight: "bold",
              }}
            />
            <Typography textAlign={"center"} variant="body2">{reg.config}</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "#1e88e5" }} onClick={() => setOpenEditReg(true)}>
                <Edit />
              </IconButton>
              <IconButton sx={{ color: "#e53935" }} onClick={() => setConfirmDeleteToggle(true)}>
                <Delete />
              </IconButton>
            </Stack>
          </Fragment>
        )}
      </Box>
      <RegForm isOpen={openEditReg} setIsOpen={setOpenEditReg} reg={reg} project={project} />

      <DeleteConfirmationDialog
        open={confirmDeleteToggle}
        projectName={project.name}
        regName={reg.displayName ?? reg.name}
        onClose={() => {
          setConfirmDeleteToggle(false)
        }}
        onConfirm={handleDelete}
      />
    </Fragment>
  )
};

export default RegItem;