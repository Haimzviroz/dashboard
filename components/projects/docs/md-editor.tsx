import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useState } from "react";
import * as commands from "@uiw/react-md-editor/commands"
import { Box } from "@mui/material";



const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface MdDocsProps {
  show: boolean
  isEditing: boolean
  content: string
  setContent: Dispatch<SetStateAction<string>>
}

const MdDocsEditor: FC<MdDocsProps> = ({ content, setContent, isEditing, show }) => {
  return (
    <Box mt={2} className={!show ? "hide-mode" : "show-mode"} >
      {(isEditing || !!content) && <MDEditor
        preview={isEditing ? undefined : "preview"}
        hideToolbar={!isEditing}
        style={{
          maskImage: show || isEditing ? undefined : 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 0) 100px)',
        }}
        value={content}
        onChange={(value?: string) => setContent(value ?? "")}
      />}
    </Box>
  );
}

export default MdDocsEditor;