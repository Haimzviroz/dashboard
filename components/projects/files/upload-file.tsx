import { ProjectDto, DetailedReleaseDto, SetReleaseArtifactDto } from "@/api/src";
import { useAddRelArt } from "@/hooks/arts.query.hook";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import { AxiosError } from "axios";
import { FC, useState, useRef, useEffect, useCallback, Fragment } from "react";

interface FileUploadProps {
  project: ProjectDto,
  rel: DetailedReleaseDto
}

const FileUpload: FC<FileUploadProps> = ({ project, rel }) => {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<number>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadErr, setUploadErr] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const uploadArt = useAddRelArt();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && !isUploading) {
      handleUpload()
    }
  }, [file])

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
        isInstallationFile: true,
      };

      setProgress(undefined)
      setIsUploading(true)
      setUploadErr(undefined)
      uploadArt.mutate({ projectName: project.name, version: rel.version, data, file: file, setProgress }, {
        onSuccess: () => {
          setIsUploading(false)
          setProgress(undefined)
          setFile(undefined)
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
    </Fragment >
  );
};

export default FileUpload
