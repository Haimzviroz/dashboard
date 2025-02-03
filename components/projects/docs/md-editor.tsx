import dynamic from "next/dynamic";
import { FC, useState } from "react";
import * as commands from "@uiw/react-md-editor/commands"



const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const MdDocs: FC = () => {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <MDEditor 
      value={value}
      onChange={(value?: string) => setValue(value || "")}
      
    />
  );
}

export default MdDocs;