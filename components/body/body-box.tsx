import { useGetApp } from "@/hooks";
import { Box, SxProps, styled } from "@mui/material";
import { FC, Fragment } from "react";

interface BodyBoxProps {
  children: React.ReactNode
  sx?: SxProps
}

const BodyBox: FC<BodyBoxProps> = ({ children, sx }) => {

  const { sideBarCollapse, } = useGetApp()

  const BodyBox = styled(Box)(({ theme }) => ({
    width: `calc(100vw - ${sideBarCollapse ? "384px" : "152px"})`,
    minHeight: "calc(100vh - 72px)",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    marginLeft: 32,
    // display: "flex",
    // overflow: "hidden",

    // Media query for smaller screens
    [theme.breakpoints.down("xl")]: {
      width: `calc(100vw - ${sideBarCollapse ? "264px" : "152px"})`,
      marginLeft: 0,
    },
  }));


  return (
    <BodyBox sx={sx}>{children}</BodyBox>
  );
}

export default BodyBox;