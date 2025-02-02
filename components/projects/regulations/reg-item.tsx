import React, { FC, Fragment, useRef, useState } from "react";
import { Typography, IconButton, Chip, Stack, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { DetailedProjectDto, RegulationDto } from "@/api/src";
import { ItemType, TableOf } from "@/pages/getapp/projects/[projectId]/regulations";
import { useDrag, useDrop } from "react-dnd";
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
  reg: RegulationDto;
  index:number
}

const RegItem: FC<RegItemProps> = ({ reg, project, index }) => {

  const [openEditReg, setOpenEditReg] = useState(false);
  const [confirmDeleteToggle, setConfirmDeleteToggle] = useState<boolean>(false);

  const delReg = useDeleteReg()

  const ref = useRef<HTMLElement>(null);

  const [, drag] = useDrag({
    type: ItemType,
    item: {...reg, index},
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    canDrop: (item: RegulationDto) => item.name != reg.name,
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Tracks if the item is currently over the target
    }),
  });

  drag(drop(ref))

  const handleDelete = () => {
    delReg.mutate({
      projectName: project.name,
      regId: reg.name
    })
  }

  function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    let oppositeColor = "#";

    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);

      // Invert the color: (255 - value)
      const invertedValue = 255 - value;
      oppositeColor += `00${invertedValue.toString(16)}`.slice(-2);
    }

    return { bgcolor: oppositeColor };
  }


  return (
    <Fragment>

      <Box ref={ref}>
        {TableOf(
          <Fragment>
            <Typography variant="body1">{reg.displayName ?? reg.name}</Typography>
            <Typography variant="body2" color="textSecondary">{reg.description}</Typography>
            <Chip
              label={reg.type.name}
              sx={{
                width: 100,
                ...stringToColor(reg.type.name),
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
        , false, index)}
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