import React, { FC } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
} from "@mui/material";
import KeyIcon from '@mui/icons-material/Key';
import AddIcon from '@mui/icons-material/Add';
import Token from "./token-list";
import { ProToken } from "@/types/interfaces";

interface TokenListProps {
  tokens?: ProToken[]
}

const ProjectTokens: FC<TokenListProps> = ({ tokens }) => {
  return (
    <Card sx={{ margin: "16px", padding: 2 }}>
      <Box display="flex" alignItems="center" marginBottom={2} gap={1}>
        <KeyIcon sx={{ rotate: "-45deg" }} />
        <Typography variant="h6" fontWeight="bold">
          Project Tokens
        </Typography>
      </Box>
      {tokens &&
        // <Grid container spacing={2}>
        // {
        tokens.map(token => <Token token={token} />)
        // }
        // </Grid>
      }

      <Box marginTop={2}>
        <Button
          variant="text"
          color="primary"
          startIcon={<AddIcon />}
          // onClick={() => setUserToggle(true)}
          sx={{ textTransform: "none", gap: 1 }}
        >
          Add Team Member
        </Button>
      </Box>

    </Card>
  );
};

export default ProjectTokens;
