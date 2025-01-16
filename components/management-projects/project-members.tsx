import React, { FC, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete as DeleteIcon, Group as GroupIcon, Edit as EditIcon } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import { Member, Project } from "@/types/interfaces";
import MemberForm from "./member-from";
import { useDeleteMember } from "@/hooks/project.query.hook";

interface StatusLabelProps {
  label: string;
}

const StatusLabel: React.FC<StatusLabelProps> = ({ label }) => {
  let bgColor;
  switch (label) {
    case "active":
      bgColor = "#4CAF50";
      break;
    case "inactive":
      bgColor = "#9E9E9E";
      break;
    case "invited":
      bgColor = "#2196F3";
      break;
    default:
      bgColor = "#4CAF50";
      break;
  }

  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: bgColor,
        color: "white",
        height: "16px",
        fontSize: "12px",
        fontWeight: "normal",
        marginTop: 0.5,
      }}
    />
  );
};

interface TeamMemberItemProps {
  member: Member;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({
  member,
  onEdit,
  onDelete,
}) => {
  function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding={1}
      borderRadius={1}
      sx={{ backgroundColor: "#f9f9f9" }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar
          src={`${member.image}`}
          alt={`${member.firstName} ${member.lastName}`}
          sx={{
            width: 48,
            height: 48,
            marginRight: 2,
            bgcolor: !member.image
              ? stringToColor(`${member.firstName} ${member.lastName}`)
              : undefined,
          }}
        />
        <Box>
          <Stack direction={"row"} gap={1}>
            <Typography variant="body1" fontWeight="bold">
              {`${member.firstName} ${member.lastName}`}
            </Typography>
            <StatusLabel label={member.status} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {member.role}
          </Typography>
        </Box>
      </Box>
      <Box>
        <IconButton onClick={onEdit} aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} color="error" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

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
  project: Project;
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
        {project.members.map((member) => (
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
          `${project.members.find((m) => m.id === selectedMember?.id)?.firstName || ""} ${project.members.find((m) => m.id === selectedMember?.id)?.lastName || ""}`
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
