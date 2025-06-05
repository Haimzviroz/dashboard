import React from "react";
import { Typography, Box } from "@mui/material";
import { DocDto } from "@/api/src";
import MdDocsEditor from "./md-editor";

interface DocViewerProps {
  doc: DocDto;
}

const DocViewer: React.FC<DocViewerProps> = ({ doc }) => {

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h6">{doc.name}</Typography>

      {doc.isUrl ? (
        <Typography variant="body1" color="primary">
          <a href={doc.docUrl} target="_blank" rel="noopener noreferrer">
            {doc.docUrl}
          </a>
        </Typography>
      ) : (
        <MdDocsEditor content={doc.readme ?? ""} setContent={() => { }} isEditing={false} show={true} />
      )}
    </Box>
  );
};

export default DocViewer;
