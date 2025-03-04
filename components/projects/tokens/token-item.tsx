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
  Tooltip,
  TextField,
} from "@mui/material";
import { DetailedProjectDto, ProjectTokenDto } from "@/api/src";
import { useDeleteToken, useUpdateToken } from "@/hooks/token.query.hook";

interface TokenProps {
  token: ProjectTokenDto;
  project: DetailedProjectDto;

}

const Token: FC<TokenProps> = ({ token, project }) => {
  const [isExpired,] = useState(token.expirationDate ? new Date(token.expirationDate) < new Date() : false)
  const [showToken, setShowToken] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const updateToken = useUpdateToken()
  const deleteToken = useDeleteToken()

  const handleUpdate = () => {
    const data = {
      name: token.name,
      isActive: !token.isActive
    }
    updateToken.mutate({ projectName: project.name, tokenId: token.id, data })
  }
  const handleDelete = () => {
    deleteToken.mutate({ projectName: project.name, tokenId: token.id })
  }

  const handleCopyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token).then(() => {
      setSnackbarOpen(true);
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
              label={(() => {
                if (!token.isActive) return "Inactive";
                if (isExpired) return "Expired";
                return "Active";
              })()}
              color={(() => {
                if (!token.isActive) return "default";
                if (isExpired) return "warning";
                return "success";
              })()}
              sx={{
                height: 20,
              }}
            />

          </Stack>
          {showToken && (
            <Box my={2}>
              <TextField
                multiline
                value={token.token}
                variant="outlined"
                fullWidth
                minRows={3}
                InputProps={{
                  style: {
                    fontSize: "10px",
                  },
                }}
              />
            </Box>
          )}

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
              {!token.neverExpires && token.expirationDate && (
                <Typography variant="body2">
                  <b>Expires On:</b> {new Date(token.expirationDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              {token.isActive && !isExpired && (
                <Tooltip title={`Click to copy, Double-click to ${showToken ? "hide" : "show"}`}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleCopyToClipboard(token.token)}
                    onDoubleClick={() => setShowToken(!showToken)}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      borderColor: "rgba(0, 0, 0, 0.2)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)", // Gentle hover color
                      },
                    }}
                  >
                    Copy / Show
                  </Button>
                </Tooltip>
              )}

              <Button
                variant="outlined"
                color={token.isActive ? "error" : "primary"}
                onClick={() => handleUpdate()}
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
                onClick={() => handleDelete()}
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
