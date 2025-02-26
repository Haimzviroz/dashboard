import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Typography, Box, MenuItem, TextField } from "@mui/material";
import { DetailedProjectDto, DocDto } from "@/api/src";
import { useAddDoc, useUpdateDoc } from "@/hooks/docs.query.hook";
import MdDocsEditor from "./md-editor";
import { useGetApp } from "@/providers/getapp.provider";

interface RegFormProps {
  project: DetailedProjectDto;
  doc?: DocDto;

}

const DocForm = forwardRef(({ project, doc }: RegFormProps, ref) => {

  const { router } = useGetApp()

  useImperativeHandle(ref, () => ({
    getHandlers() {
      return { handleSubmit, handleClose }
    }
  }));

  const [content, setContent] = useState(doc?.readme ?? "");

  const [formData, setFormData] = useState<Omit<DocDto, "id" | "createdAt" | "updatedAt" | "isUrl"> & { type: "URL" | "Markdown" | "", isUrl: boolean | undefined }>({
    name: doc?.name ?? "",
    isUrl: doc?.isUrl ?? undefined,
    docUrl: doc?.docUrl ?? "",
    type: doc ? doc.isUrl ? "URL" : "Markdown" : ""
  });

  const getNoError = () => ({
    name: "",
    docUrl: "",
    type: ""
  })

  const [errors, setErrors] = useState(getNoError());

  const addDoc = useAddDoc()
  const updateDoc = useUpdateDoc()


  const validateForm = () => {
    let docUrlErr: string | undefined
    if (formData.docUrl) {
      try {
        new URL(formData.docUrl)
      } catch (error: any) {
        docUrlErr = error.message
      }
    }

    let newErrors = {
      name: formData.name.trim() ? "" : "Name is required",
      type: formData.type ? "" : "Type is required",
      docUrl: formData.isUrl ? formData.docUrl ? !!docUrlErr ? docUrlErr : "" : "URL is required" : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ ...errors, [e.target.name]: "" })
    if (e.target.name === "type") {
      const value = e.target.value
      if (value === "URL") {
        setFormData({ ...formData, type: "URL", isUrl: true });
      } else {
        setFormData({ ...formData, type: "Markdown", isUrl: false });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleClose = () => {
    router.push(router.asPath.replace(/\/new$/, ``), undefined, { shallow: true });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const data = {
      name: formData.name,
      isUrl: formData.isUrl as boolean,
      docUrl: formData.docUrl,
      readme: content
    }
    if (doc) {
      updateDoc.mutate({ projectName: project.name, docId: doc.id, data })
    } else {
      addDoc.mutate({ projectName: project.name, data }, {
        onSuccess: () => handleClose()
      })
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h6">{doc ? "Edit Document" : "Create New Document"}</Typography>

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextField
        select
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={!!errors.type}
        helperText={errors.type}
      >
        {["URL", "Markdown"].map((t) => (
          <MenuItem key={t} value={t} sx={{ width: "100%" }}>
            <Typography variant="body1">{t}</Typography>
          </MenuItem>
        ))}
      </TextField>

      {formData.type === "Markdown" && <MdDocsEditor content={content} setContent={setContent} isEditing={true} show={true} />}


      {formData.type === "URL" && <TextField
        label="URL"
        name="docUrl"
        value={formData.docUrl}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.docUrl}
        helperText={errors.docUrl}
      />}

      {/* <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {doc ? "Update" : "Create"}
        </Button>
      </Stack> */}
    </Box>
  );
});

DocForm.displayName = 'DocForm';
export default DocForm;
