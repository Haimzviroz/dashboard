import { Box, Icon } from "@mui/material";
import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react";
import ArrowDown from "../../../assets/arrows/single-arrow-down.svg"
import ArrowLeft from "../../../assets/arrows/single-arrow-Left.svg"
import O_IconButton from "@/ui/o-icon-button";

interface LabelCellProps {
  id: string,
  mode: "page" | "modal",
  cDevice: string,
  setC_Device: Dispatch<SetStateAction<string>>
}

const LabelCell: FC<LabelCellProps> = ({ id, mode, setC_Device, cDevice }) => {

  const [isOpen, setIsOpen] = useState<boolean>(id === cDevice)

  useEffect(() => {
    setIsOpen(id === cDevice)
  }, [cDevice])


  const handleArrowClick = (e: React.MouseEvent) => {
    // if (mode === "page") {
      setC_Device(c => c == id ? "" : id)
      //  if (cDevice != id) window.location.hash = "" 
      // window.location.hash = cDevice == id ? "" : id

    // } else {
    //   setIsOpen(isOpen => !isOpen)
    // }
  }

  return (
    <Box onClick={handleArrowClick}>{<O_IconButton> {isOpen ? <ArrowDown /> : <ArrowLeft />}</O_IconButton>}</Box>
  );
}

export default LabelCell;