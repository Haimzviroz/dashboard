import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SetReleaseArtifactDto, SetReleaseArtifactResDto } from "@/api/src";
import { removeRelArt, uploadRelArt } from "@/apis/client-side/arts-actions.api";
import { Q_RELEASE } from "@/apis/query-keys";
import { Dispatch, SetStateAction } from 'react';
import axios from "axios";

type UploadDockerMes = { projectName: string, version: string, data: SetReleaseArtifactDto }
type UploadFileMes = UploadDockerMes & { file: File, setProgress?: Dispatch<SetStateAction<number | undefined>> }
type RemoveMes = { projectName: string, version: string, artifactId: number }

const uploadArt = async (uploadMes: UploadFileMes) => {
  const artRes = await uploadRelArt(uploadMes.projectName, uploadMes.version, uploadMes.data);

  if (!artRes.uploadUrl) throw new Error("Upload URL not received");

  const file = uploadMes.file;
  const mimeType = file.type || "application/octet-stream";
  await axios.put(artRes.uploadUrl, file, {
    headers: {
      // "Content-Type": mimeType,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        uploadMes.setProgress?.(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });
  return artRes.artifactId
}

export const useAddFileArt = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (uploadMes: UploadFileMes) =>
      uploadArt(uploadMes),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: number, uploadMes: UploadFileMes) => {
      client.refetchQueries({ queryKey: [Q_RELEASE, uploadMes.version] })
    },
    // onError: (error => alert(error))
  })
}

export const useAddDockerArt = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (uploadMes: UploadDockerMes) => 
      uploadRelArt(uploadMes.projectName, uploadMes.version, uploadMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: SetReleaseArtifactResDto, uploadMes: UploadDockerMes) => {
      client.refetchQueries({ queryKey: [Q_RELEASE, uploadMes.version] })
    },
    // onError: (error => alert(error))
  })
}

export const useRmRelArt = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (removeMes: RemoveMes) =>
      removeRelArt(removeMes.projectName, removeMes.version, removeMes.artifactId),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, removeMes: RemoveMes) => {
      client.refetchQueries({ queryKey: [Q_RELEASE, removeMes.version] })
    },
    onError: (error => alert(error))
  })
}

