import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useState } from "react";
import * as commands from "@uiw/react-md-editor/commands"
import { Box } from "@mui/material";



const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface MdDocsProps {
  content: string
  setContent: Dispatch<SetStateAction<string>>
}

const MdDocs: FC<MdDocsProps> = ({ content, setContent }) => {
  return (
    <Box mt={2}>
      <MDEditor
        value={content}
        onChange={(value?: string) => setContent(value ?? "")}
      />
    </Box>
  );
}

export default MdDocs;