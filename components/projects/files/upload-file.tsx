import { ProjectDto, DetailedReleaseDto, SetReleaseArtifactDto } from "@/api/src";
import { useAddFileArt } from "@/hooks/arts.query.hook";
import { Box, Typography, LinearProgress, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { AxiosError } from "axios";
import { FC, useState, useRef, useEffect, useCallback, Fragment } from "react";

interface FileUploadProps {
  project: ProjectDto,
  rel: DetailedReleaseDto
  deployable?: boolean
  onSuccess?: (data?: number) => void
}

const FileUpload: FC<FileUploadProps> = ({ project, rel, deployable, onSuccess }) => {
  const [file, setFile] = useState<File>();
  const [isInstallFile, setIsInstallFile] = useState<boolean | undefined>(deployable);
  const [openIsInstallDialog, setOpenIsInstallDialog] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadErr, setUploadErr] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const uploadArt = useAddFileArt();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && isInstallFile === undefined) {
      setOpenIsInstallDialog(true)
    }
    if (file && !isUploading && isInstallFile !== undefined) {
      handleUpload()
    }
  }, [file, isInstallFile])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (!!event.dataTransfer.files.length) {
      setFile(event.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = () => {
    if (file) {
      const data: SetReleaseArtifactDto = {
        artifactName: file?.name,
        type: "file",
        isInstallationFile: isInstallFile,
      };

      setProgress(undefined)
      setIsUploading(true)
      setUploadErr(undefined)
      uploadArt.mutate({ projectName: project.name, version: rel.version, data, file: file, setProgress }, {
        onSuccess: (data: number) => {
          onSuccess && onSuccess(data)
          clearState()
        },
        onError: (err: any) => {
          if (err instanceof AxiosError) {
            const mes = `Upload failed, ${err.response?.statusText ?? err.message ?? "Unknown error"}`
            setUploadErr(mes)
          } else {
            setUploadErr(`Upload failed, ${err.toString()}`)
          }
          setIsUploading(false)
        }
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmation = (confirmed: boolean) => {
    setIsInstallFile(confirmed);
    setOpenIsInstallDialog(false);
  };

  const cancelUpload = () => {
    clearState()
    setOpenIsInstallDialog(false)
  }

  const clearState = () => {
    setIsUploading(false)
    setProgress(undefined)
    setFile(undefined)
    setIsInstallFile(undefined)
    fileInputRef.current && (fileInputRef.current.value = "");
  }


  const isInstallDialog = () => (
    <Dialog open={openIsInstallDialog} onClose={() => setOpenIsInstallDialog(false)}>
      <DialogContent>
        {file && (
          <Typography variant="body1">{`The selected file "${file.name}" is an installation file?`}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button sx={{ color: "red" }} onClick={() => cancelUpload()}>Cancel</Button>
        <Button onClick={() => handleConfirmation(true)}>Yes</Button>
        <Button onClick={() => handleConfirmation(false)}>No</Button>
      </DialogActions>
    </Dialog>
  )


  return (
    <Fragment>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        p={2}
        border={`${isDragging ? "4px" : "2px"} dashed`}
        borderColor={isDragging ? "primary.main" : "#aaa"}
        borderRadius="8px"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        sx={{ cursor: "pointer", transition: "border-color 0.2s ease-in-out" }}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ position: "absolute", width: "1px", height: "1px", visibility: "hidden" }} onChange={handleFileChange}
          disabled={isUploading}
        />
        <Typography variant="body1" color="textSecondary">
          {!file ? `Drag & Drop a file here or Click to select` : `'${file.name}' - is ${isUploading ? "uploading" : "selected"}`}
        </Typography>
      </Box>
      <Box py={2} display="flex" flexDirection="column" alignItems="center">
        {!!progress && isUploading &&
          <Fragment>
            <LinearProgress variant="determinate" value={progress} sx={{ width: "100%" }} color={uploadErr ? "error" : "secondary"} />
            <Typography variant="body2" color="secondary">{`${progress}%`}</Typography>
          </Fragment>
        }
        {uploadErr &&
          <Fragment>
            <Typography variant="body2" color="error">{`${uploadErr}`}</Typography>
            <Button size='small' onClick={() => handleUpload()}>Try again</Button>
          </Fragment>
        }
      </Box >
      {isInstallDialog()}
    </Fragment >
  );
};

export default FileUpload
