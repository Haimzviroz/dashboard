import React, { FC, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import KeyIcon from '@mui/icons-material/Key';
import AddIcon from '@mui/icons-material/Add';
import Token from "./token-item";
import { CreateProjectTokenDto, DetailedProjectDto, ProjectTokenDto } from "@/api/src";
import { useCreateToken } from "@/hooks/token.query.hook";

interface TokenListProps {
  tokens?: ProjectTokenDto[]
  project: DetailedProjectDto;

}

const ProjectTokens: FC<TokenListProps> = ({ tokens, project }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(true);
  const createToken = useCreateToken();

  const handleAddToken = () => {
    const data: CreateProjectTokenDto = {
      name: newTokenName,
      neverExpires: !isExpired,
      expirationDate: expirationDate ? new Date(expirationDate).toISOString() : undefined,
    };

    createToken.mutate({ projectName: project.name, data }, {
      onSuccess: () => {
        setDialogOpen(false);
        setNewTokenName("");
        setExpirationDate(null);
      },
    });
  };
  return (
    <Card sx={{ margin: "16px", padding: 2 }}>
      <Box display="flex" alignItems="center" marginBottom={2} gap={1}>
        <KeyIcon sx={{ rotate: "-45deg" }} />
        <Typography variant="h6" fontWeight="bold">
          Project Tokens
        </Typography>
      </Box>
      {tokens && tokens.map(token => <Token token={token} project={project} />)}
      <Box marginTop={2}>
        <Button
          variant="text"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ textTransform: "none", gap: 1 }}
        >
          Add Token
        </Button>
      </Box>

      {/* Add Token Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { width: 480 } }}
      >
        <DialogTitle>Add New Token</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Token Name"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              fullWidth
            />
            {isExpired && (
              <TextField
                label="Expiration Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={expirationDate || ""}
                onChange={(e) => setExpirationDate(e.target.value)}
                fullWidth
              />
            )}
            <Box display="flex" alignItems="center" gap={1}>
              <input
                type="checkbox"
                checked={isExpired}
                onChange={(e) => {
                  setIsExpired(e.target.checked);
                  if (e.target.checked) {
                    setExpirationDate(null); // Reset expiration date if no expiration is selected
                  }
                }}
              />
              <Typography>Token with expiration time</Typography>
            </Box>
            {!isExpired && (
              <Alert severity="warning">
                This token will be created <strong>without an expiration time</strong>.
              </Alert>
            )}
            {isExpired && expirationDate && new Date(expirationDate) < new Date() && (
              <Alert severity="warning">
                The expiration date is in the past. This token will be marked as expired.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddToken}
            color="primary"
            variant="contained"
            disabled={!newTokenName || (isExpired && !expirationDate)}
          >
            Add Token
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProjectTokens;
