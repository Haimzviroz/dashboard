import React, { FC, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Group as GroupIcon } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import { DetailedProject, Member } from "@/types/interfaces";
import MemberForm from "./member-from";
import { useDeleteMember } from "@/hooks/project.query.hook";
import TeamMemberItem from "../team-member";


interface DeleteConfirmationDialogProps {
  open: boolean;
  memberName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  memberName,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete <strong>{memberName}</strong>?
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

interface TeamMembersProps {
  project: DetailedProject;
}

const TeamMembers: FC<TeamMembersProps> = ({ project }) => {
  const [addUserToggle, setUserToggle] = useState<boolean>(false);
  const [confirmDeleteToggle, setConfirmDeleteToggle] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<Member>();

  const delMember = useDeleteMember();

  const handleDelete = () => {
    if (selectedMember) {
      delMember.mutate({
        projectName: project.name,
        memberId: selectedMember?.id,
      });
      setConfirmDeleteToggle(false);
      setSelectedMember(undefined)
    }
  };

  return (
    <Card sx={{ margin: "16px", padding: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" marginBottom={2} gap={1}>
        <GroupIcon />
        <Typography variant="h6" fontWeight="bold">
          Team Members
        </Typography>
      </Box>

      {/* Members List */}
      <Stack spacing={2}>
        {project.members?.map((member) => (
          <TeamMemberItem
            key={member.id}
            member={member}
            onEdit={() => {
              setSelectedMember(member);
              setUserToggle(true)
            }}
            onDelete={() => {
              setSelectedMember(member);
              setConfirmDeleteToggle(true);
            }}
          />
        ))}
      </Stack>

      {/* Add Member Button */}
      <Box marginTop={2}>
        <Button
          variant="text"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setUserToggle(true)}
          sx={{ textTransform: "none", gap: 1 }}
        >
          Add Team Member
        </Button>
      </Box>

      {/* Modals */}
      <Dialog open={addUserToggle} onClose={() => {
        setUserToggle(false)
        setSelectedMember(undefined)
      }}
        PaperProps={{ sx: { minWidth: 480, "& .MuiCard-root": { minWidth: 420 } } }}
      >
        <MemberForm project={project} setUserToggle={setUserToggle} member={selectedMember} />
      </Dialog>

      <DeleteConfirmationDialog
        open={confirmDeleteToggle}
        memberName={
          `${project.members?.find((m) => m.id === selectedMember?.id)?.firstName || ""} ${project.members?.find((m) => m.id === selectedMember?.id)?.lastName || ""}`
        }
        onClose={() => {
          setConfirmDeleteToggle(false)
          setSelectedMember(undefined)
        }}
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default TeamMembers;
