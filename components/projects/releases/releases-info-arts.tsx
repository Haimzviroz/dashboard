import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { DetailedReleaseDto, PrepareDeliveryReqDto, ProjectDto, ReleaseArtifactDto, SetReleaseDto } from '@/api/src';
import { Alert, Box, Button, Chip, Container, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Snackbar, Stack, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import { Description } from '@mui/icons-material';
import { CloudDownload, ContentCopy, Layers } from '@mui/icons-material';
import { prepareDelivery } from '@/apis/client-side/delivery-actions.api';
import { useRmRelArt } from '@/hooks/arts.query.hook';
import axios from 'axios';
import FileUpload from '../files/upload-file';


interface ArtItemProps {
  project: ProjectDto;
  rel: DetailedReleaseDto;
  art: ReleaseArtifactDto;
}

const ArtItem: FC<ArtItemProps> = ({ project, rel, art }) => {

  const rmArt = useRmRelArt()
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const data: PrepareDeliveryReqDto = {
        catalogId: rel.id,
        deviceId: 'Dashboard',
        itemType: 'software'
      }

      const prepareRes = await prepareDelivery(data)
      if (prepareRes.status === 'error') {
        throw new Error(prepareRes.error?.message)
      }

      if (prepareRes.artifacts?.length) {
        const relatedArt = prepareRes.artifacts.find(a => a.id === art.id)
        if (relatedArt) {
          axios.get(relatedArt.url, {
            responseType: "blob", // Ensures correct binary data
          }).then(response => {
            const mimeType = response.headers["content-type"] || "application/octet-stream";
            const blob = new Blob([response.data], { type: mimeType });
            const downloadUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = art.artifactName || "GetApp-artifact";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl); // Clean up memory
          }).catch(error => {
            console.error("Download failed:", error);
          });
        }
      }
    } catch (error: any) {
      console.error(`Failed to download artifact, ${error.toString()}`)
    }

  };


  const handleCopyCommand = () => {
    if (art.dockerImageUrl) {
      const dockerPullCommand = `docker pull ${art.dockerImageUrl}`;
      navigator.clipboard.writeText(dockerPullCommand)
        .then(() => {
          setSnackbarOpen(true); // Show Snackbar
        })
        .catch(err => console.error("Failed to copy:", err));
    }
  };

  const renderActions = () => {
    if (art.type === "file") {
      return (
        <IconButton aria-label="download" onClick={handleDownload}>
          <CloudDownload />
        </IconButton>
      );
    } else if (art.type === "docker_image") {
      return (
        <IconButton aria-label="copy command" onClick={handleCopyCommand}>
          <ContentCopy />
        </IconButton>
      );
    }
    return null;
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    rmArt.mutate({ projectName: project.name, version: rel.version, artifactId: art.id })
  }

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const snackbarBody = () => (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
        Docker pull command copied!
      </Alert>
    </Snackbar>
  )


  return (
    <Fragment>
      <ListItem sx={{ p: 0 }}>
        <ListItemIcon sx={{ minWidth: 36 }}>
          {art.type === "file" ? <Description /> : <Layers />}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center">
              <Typography variant="body1">{art.artifactName}</Typography>
              {art.isInstallationFile && (
                <Chip
                  label="Deployable"
                  color="success"
                  size="small"
                  sx={{
                    backgroundColor: '#64b5f6', // Soft green
                    color: 'white',
                    ml: 1,
                    fontSize: '0.6rem',  // Smaller font
                    height: 14,  // Reduce height
                    padding: '0px 4px',  // Minimize padding
                    '& .MuiChip-label': {
                      padding: .5, // Remove additional padding
                    },
                  }}
                />
              )}
            </Box>
          }
          secondary={<Typography variant="body2" sx={{ fontSize: 12, opacity: .7 }}>{art.type === "file" ? "File" : "Docker Image"}</Typography>}
        />
        <Stack direction="row" height={24} >
          {renderActions()}
          <IconButton sx={{ p: .25 }} onClick={handleRemove} >
            <RemoveIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      </ListItem>
      <Divider />
      {snackbarBody()}
    </Fragment>
  )
};


interface RelInfoArtsProps {
  project: ProjectDto
  rel: DetailedReleaseDto;
  setRel: Dispatch<SetStateAction<SetReleaseDto>>
}

const RelInfoArts: FC<RelInfoArtsProps> = ({ project, rel, setRel }) => {
  const [addArt, setAddArt] = useState<boolean>(false)

  return (
    <Fragment>
      {rel.artifacts?.map((art) => (
        <Box key={art.id + art.artifactName} >
          <ArtItem project={project} rel={rel} art={art} />
        </Box>
      ))}
      <Box marginTop={2}>
        {!addArt
          ?
          <Button
            variant="text"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddArt(true)}
            sx={{ textTransform: "none", gap: 1 }}
          >
            Add Artifact
          </Button>
          : <FileUpload project={project} rel={rel} />
        }
      </Box>
    </Fragment>
  );
};

export default RelInfoArts;
