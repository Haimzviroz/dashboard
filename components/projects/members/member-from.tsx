import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Autocomplete,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { getUsers } from "@/apis/client-side/projects-actions.api";
import { Member } from "@/types/interfaces";
import { useAddMember, useUpdateMember } from "@/hooks/project-member.query.hook";
import { DetailedProjectDto } from "@/api/src";


const roles = [{ id: "project-admin", name: "Admin" }, { id: "project-member", name: "Member" }];

interface MemberFormProps {
  project: DetailedProjectDto
  setUserToggle: Dispatch<SetStateAction<boolean>>,
  member?: Member
}

const MemberForm: FC<MemberFormProps> = ({ project, setUserToggle, member }) => {
  const [email, setEmail] = useState(member?.email || "");
  const [role, setRole] = useState(member?.role || "");
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<Member[]>([]);


  const addMember = useAddMember()
  const updateMember = useUpdateMember()

  const fetchUsers = async (query: string) => {
    setLoading(true);
    try {
      const users = await getUsers({ email: query })
      setLoading(false);
      return users
    } catch (error) {
      console.error(`Err getting all users: ${error}`);
      setLoading(false);
    }
  };

  const handleEmailChange = async (value: string) => {
    setEmail(value);
    if (value.length >= 2) {
      const users = await fetchUsers(value);
      setSuggestedUsers(users)
    } else {
      setSuggestedUsers([]);
    }
  };

  const handleUserSelect = (user: any) => {
    if (user) {
      setEmail(user.email);
    }
  };

  const handleSubmit = async () => {
    if (!email || !role) {
      alert("Email and role are required!");
      return;
    }

    if (member) {
      updateMember.mutate({ projectName: project.name, memberId: member.id, data: { role } })
    } else {
      addMember.mutate({ projectName: project.name, data: { email, role } })
    }

    setEmail("");
    setRole("");
    setSuggestedUsers([]);
    setUserToggle(false)
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "16px auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" marginBottom={2}>
          {member ? "Update user" : `Invite a new user to ${project.name}`}
        </Typography>

        {/* Email Field with Suggestions */}
        <Autocomplete
          disabled={member ? true : false}
          fullWidth
          value={member ? member : null} // Ensure the email is displayed
          options={suggestedUsers}
          getOptionLabel={(option) => option.email}
          isOptionEqualToValue={(option, value) => option.email === value.email}
          noOptionsText="No matching users"
          loading={loading}
          onChange={(e, value) => handleUserSelect(value)}
          renderOption={(props, option) => (
            <li {...props} style={{ width: "100%" }}>
              <Box >
                <Typography variant="h6">{`${option.firstName} ${option.lastName}`}</Typography>
                <Typography variant="body2">{`${option.email}`}</Typography>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Email"
              variant="outlined"
              value={email}
              required
              onChange={(e) => !member && handleEmailChange(e.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              fullWidth
              margin="normal"
            />
          )}
        />

        {/* <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          sx={{
            "& .MuiInputLabel-root": {
              right: "50px", // Moves the label to the right
            },
          }}
        />

        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Profile Image URL"
          value={profileImage}
          onChange={(e) => setProfileImage(e.target.value)}
          fullWidth
          margin="normal"
        /> */}

        {/* Role */}
        <TextField
          select
          label="Role"
          value={role}
          required
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id} sx={{ width: "100%" }} >
              {role.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {member ? "Update" : "Invite User"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MemberForm;
