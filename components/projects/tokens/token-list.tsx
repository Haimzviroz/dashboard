import React, { FC, Fragment, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CardContent,
  Card,
  Snackbar,
  Chip,
  Stack,
} from "@mui/material";
import { ProToken } from "@/types/interfaces";

interface TokenProps {
  token: ProToken;
}

const Token: FC<TokenProps> = ({ token }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRevoke = (id: number) => {
    console.log(`Token with ID ${id} revoked`);
    // Add logic for revoking the token
  };

  const handleCopyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token).then(() => {
      setSnackbarOpen(true); // Show confirmation snackbar
    });
  };

  return (
    <Fragment>

      <Card
        key={token.id}
        sx={{
          my: 2,
          border: "1px solid rgba(0, 0, 0, 0.15)",
          borderRadius: 2,
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)", // Softer hover effect
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)", // Gentle shadow
          },
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent={"flex-start"} alignItems={"center"} gap={1}>
            <Typography variant="h6">{token.name}</Typography>
            <Chip
              label={token.isActive ? "Active" : "Inactive"}
              color={token.isActive ? "success" : "default"}
              sx={{height:20
              }}
            />
          </Stack>

          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box
              display="flex"
              flexDirection="column"
              gap={0}
              mt={1}
              color="textSecondary"
            >
              <Typography variant="body2">
                <b>Created On: </b> {new Date(token.createdAt).toLocaleDateString()}
              </Typography>
              {!token.neverExpires && (
                <Typography variant="body2">
                  <b>Expires On:</b> {new Date(token.expirationDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              {/* Active/Inactive Indicator */}


              {/* Action Buttons */}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleCopyToClipboard(token.token)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderColor: "rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)", // Gentle hover color
                  },
                }}
              >
                Copy
              </Button>
              <Button
                variant="outlined"
                color={token.isActive ? "error" : "primary"}
                // onClick={() => (token.isActive ? handleRevoke(token.id) : handleActivate(token.id))}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderColor: token.isActive ? "rgba(255, 0, 0, 0.6)" : "rgba(0, 0, 255, 0.6)",
                  color: token.isActive ? "error.main" : "primary.main",
                  "&:hover": {
                    backgroundColor: token.isActive
                      ? "rgba(255, 0, 0, 0.1)" // Subtle red hover for "Revoke"
                      : "rgba(0, 0, 255, 0.1)", // Subtle blue hover for "Activate"
                  },
                }}
              >
                {token.isActive ? "Revoke" : "Activate"}
              </Button>

              {/* Delete Button */}
              <Button
                variant="contained"
                color="error"
                // onClick={() => handleDelete(token.id)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "rgba(255, 0, 0, 0.8)", // Solid red for "Delete"
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 1)", // Slightly darker red on hover
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Snackbar for Copy Confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Token copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Fragment>
  );
};

export default Token;
