import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { DetailedReleaseDto, PrepareDeliveryReqDto, ProjectDto, ReleaseArtifactDto, SetReleaseDto } from '@/api/src';
import { Alert, Box, Button, Chip, Container, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Snackbar, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Description } from '@mui/icons-material';
import { CloudDownload, ContentCopy, Layers } from '@mui/icons-material';
import { prepareDelivery } from '@/apis/client-side/delivery-actions.api';


interface ArtItemProps {
  rel: DetailedReleaseDto;
  art: ReleaseArtifactDto;
}

const ArtItem: FC<ArtItemProps> = ({ rel, art }) => {

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
          const link = document.createElement("a");
          link.href = relatedArt.url;
          link.download = art.artifactName || "GetApp-artifact";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
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
        <IconButton edge="end" aria-label="download" onClick={handleDownload}>
          <CloudDownload />
        </IconButton>
      );
    } else if (art.type === "docker_image") {
      return (
        <IconButton edge="end" aria-label="copy command" onClick={handleCopyCommand}>
          <ContentCopy />
        </IconButton>
      );
    }
    return null;
  };

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
              <Typography variant="h6">{art.artifactName}</Typography>
              {art.isInstallationFile && (
                <Chip
                  label="Deployable"
                  color="success"
                  size="small"
                  sx={{
                    backgroundColor: '#64b5f6', // Soft green
                    color: 'white',
                    ml: 1,
                    fontSize: '0.65rem',  // Smaller font
                    height: 16,  // Reduce height
                    padding: '0px 4px',  // Minimize padding
                    '& .MuiChip-label': {
                      padding: 0, // Remove additional padding
                    },
                  }}
                />
              )}
            </Box>
          }
          secondary={<Typography variant="body2">{art.type === "file" ? "File" : "Docker Image"}</Typography>}
        />
        {renderActions()}
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
  const [addDepend, setAddDepend] = useState<boolean>(false)

  return (
    <Container>
      {rel.artifacts?.map((art) => (
        <Box key={art.id} >
          <ArtItem rel={rel} art={art} />
        </Box>
      ))}
      {/* {addDepend && <ArtItem project={project} edit={true} setRel={setRel} close={() => setAddDepend(false)}></ArtItem>} */}
      <Box marginTop={2}>
        <Button
          variant="text"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDepend(true)}
          sx={{ textTransform: "none", gap: 1 }}
        >
          Add Artifact
        </Button>
      </Box>

    </Container>
  );
};

export default RelInfoArts;
