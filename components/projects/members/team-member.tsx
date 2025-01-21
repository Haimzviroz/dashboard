import { Member } from "@/types/interfaces";
import { Box, Avatar, Stack, Typography, IconButton, Chip } from "@mui/material";
import { Delete as DeleteIcon, Group as GroupIcon, Edit as EditIcon } from "@mui/icons-material";
import { MemberResDto } from "@/api/src";


interface TeamMemberItemProps {
  member: MemberResDto;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({
  member,
  onEdit,
  onDelete,
}) => {

  const StatusLabel = (label: string) => {
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
          // src={`${member.image}`}
          alt={`${member.firstName} ${member.lastName}`}
          sx={{
            width: 48,
            height: 48,
            marginRight: 2,
            // bgcolor: !member.image
            bgcolor: true
              ? stringToColor(`${member.firstName} ${member.lastName}`)
              : undefined,
          }}
        />
        <Box>
          <Stack direction={"row"} gap={1}>
            <Typography variant="body1" fontWeight="bold">
              {`${member.firstName} ${member.lastName}`}
            </Typography>
            {member.status && StatusLabel(member.status)}
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

export default TeamMemberItem