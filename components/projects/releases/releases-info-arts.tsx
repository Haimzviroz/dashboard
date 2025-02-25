import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { DetailedReleaseDto, ProjectDto, ReleaseArtifactDto, SetReleaseArtifactDto, SetReleaseDto } from '@/api/src';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import { Description } from '@mui/icons-material';
import { CloudDownload, ContentCopy, Layers } from '@mui/icons-material';
import { useAddDockerArt, useRmRelArt } from '@/hooks/arts.query.hook';
import FileUpload from '../files/upload-file';
import { downloadArt } from '@/apis/client-side/arts-actions.api';
import { BASE_PATHS } from '@/apis/paths';


interface ArtItemProps {
  project: ProjectDto;
  rel: DetailedReleaseDto;
  art: ReleaseArtifactDto;
}

const ArtItem: FC<ArtItemProps> = ({ project, rel, art }) => {

  const rmArt = useRmRelArt()
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDownload = async () => {
    const reqArgs = await downloadArt(project.name, rel.version, art.artifactName);

    const link = document.createElement("a");
    link.href = BASE_PATHS + reqArgs.url;
    link.download = art.artifactName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
  const [addArt, setAddArt] = useState<boolean>(false);
  const [addDocker, setAddDocker] = useState<boolean>(false);
  const [dockerUrl, setDockerUrl] = useState<string>("");
  const [artifactName, setArtifactName] = useState<string>("");
  const [error, setError] = useState<{ url?: string; name?: string }>({});
  const uploadDocker = useAddDockerArt();

  const extractDockerImageName = (dockerImageUrl: string): string | undefined => {
    const regex = /(?:[a-zA-Z0-9.-]+\/)?([a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9.-]+)*)(?::([a-zA-Z0-9.-]+))?/;
    const match = dockerImageUrl.match(regex);

    if (match) {
      const imageName = match[1].split('/').pop();
      return match[2] ? `${imageName}:${match[2]}` : imageName;
    }
  };

  const handleDockerUpload = () => {
    const errors: { url?: string; name?: string } = {};
    console.log(extractDockerImageName(dockerUrl));

    if (!dockerUrl.trim()) {
      errors.url = "Docker image URL is required.";
    }
    if (!!artifactName && !extractDockerImageName(dockerUrl)) {
      errors.name = "Set a name for the artifact.";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const data: SetReleaseArtifactDto = {
      artifactName: artifactName || extractDockerImageName(dockerUrl) || "Docker Image",
      type: "docker_image",
      dockerImageUrl: dockerUrl,
    };

    uploadDocker.mutate({ projectName: project.name, version: rel.version, data });

    setAddDocker(false);
    setDockerUrl(""); // Reset input
    setArtifactName(""); // Reset artifact name
    setError({}); // Clear errors
  };

  const addDockerDialog = () => (
    <Dialog open={addDocker} onClose={() => setAddDocker(false)}>
      <DialogTitle>Add Docker Artifact</DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%", minWidth: 400, mx: "auto", mt: 1 }}>
          <TextField
            label="Artifact Name"
            fullWidth
            value={artifactName}
            onChange={(e) => {
              setArtifactName(e.target.value);
              setError((prev) => ({ ...prev, name: "" }));
            }}
            error={!!error.name}
            helperText={error.name}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            required
            label="Docker Image URL"
            fullWidth
            value={dockerUrl}
            onChange={(e) => {
              setDockerUrl(e.target.value);
              setError((prev) => ({ ...prev, url: "" }));
            }}
            error={!!error.url}
            helperText={error.url}
            variant="outlined"
            sx={{
              "& label": {
                width: "fit-content"
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddDocker(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleDockerUpload} color="primary" variant="contained">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Fragment>
      {rel.artifacts?.map((art) => (
        <Box key={art.id + art.artifactName}>
          <ArtItem project={project} rel={rel} art={art} />
        </Box>
      ))}
      <Stack direction="row" gap={2} marginTop={2}>
        {!addArt && (
          <Fragment>
            <Button
              variant="text"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddArt(true)}
              sx={{ textTransform: "none" }}
            >
              Add File Artifact
            </Button>
            <Divider orientation="vertical" color="#1976d2" flexItem />
          </Fragment>
        )}
        <Button
          variant="text"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDocker(true)}
          sx={{ textTransform: "none" }}
        >
          Add Docker Artifact
        </Button>
      </Stack>
      {addArt && (
        <Box marginTop={2}>
          <FileUpload project={project} rel={rel} />
        </Box>
      )}
      {addDocker && addDockerDialog()}
    </Fragment>
  );
};

export default RelInfoArts;
