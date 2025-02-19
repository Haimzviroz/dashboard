import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SetReleaseArtifactDto } from "@/api/src";
import { RemoveRelArt, uploadRelArt } from "@/apis/client-side/arts-actions.api";
import { Q_RELEASE } from "@/apis/query-keys";
import { Dispatch, SetStateAction } from 'react';
import axios from "axios";

type UploadMes = { projectName: string, version: string, data: SetReleaseArtifactDto, file: File, setProgress?: Dispatch<SetStateAction<number | undefined>> }
type RemoveMes = { projectName: string, version: string, artifactId: number }

const uploadArt = async (uploadMes: UploadMes) => {
  const artRes = await uploadRelArt(uploadMes.projectName, uploadMes.version, uploadMes.data);

  if (!artRes.uploadUrl) throw new Error("Upload URL not received");

  const file = uploadMes.file;
  const mimeType = file.type || "application/octet-stream"; // Default for unknown file types

  await axios.put(artRes.uploadUrl, file, {
    headers: {
      "Content-Type": mimeType, // Ensures server handles file correctly
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        uploadMes.setProgress?.(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });
}

export const useAddRelArt = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (uploadMes: UploadMes) =>
      uploadArt(uploadMes),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, uploadMes: UploadMes) => {
      client.refetchQueries({ queryKey: [Q_RELEASE, uploadMes.version] })
    },
    // onError: (error => alert(error))
  })
}

export const useRmRelArt = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (removeMes: RemoveMes) =>
      RemoveRelArt(removeMes.projectName, removeMes.version, removeMes.artifactId),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, removeMes: RemoveMes) => {
      client.refetchQueries({ queryKey: [Q_RELEASE, removeMes.version] })
    },
    onError: (error => alert(error))
  })
}

