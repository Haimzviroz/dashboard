// import { useSideBar } from "@/providers/sidebar.provider";
// import { Box, SxProps, styled } from "@mui/material";
// import { FC, Fragment } from "react";

// interface BodyBoxProps {
//   children: React.ReactNode
//   sx?: SxProps
// }

// const BodyBox: FC<BodyBoxProps> = ({ children, sx }) => {

//   const { sideBarCollapse, } = useSideBar()
//   console.log({sideBarCollapse});


//   const BodyBox = styled(Box)(({ theme }) => ({
//     width: `calc(100vw - 152px)`,
//     minHeight: "calc(100vh - 72px)",
//     backgroundColor: "#FFF",
//     borderTopLeftRadius: 24,
//     marginLeft: 32,
//     // display: "flex",
//     // overflow: "hidden",

//     // Media query for smaller screens
//     [theme.breakpoints.down("xl")]: {
//       width: `calc(100vw - ${sideBarCollapse ? "264px" : "152px"})`,
//       marginLeft: 0,
//     },
//   }));


//   return (
//     <BodyBox sx={sx}>{children}</BodyBox>
//   );
// }

// export default BodyBox;

import { FC, memo } from "react";
import { SxProps } from "@mui/material";

interface BodyBoxProps {
  children: React.ReactNode;
}

const BodyBox: FC<BodyBoxProps> = ({ children }) => {
  return <StyledBodyBox>{children}</StyledBodyBox>;
};

export default memo(BodyBox);


import { useSideBar } from "@/providers/sidebar.provider";
import { Box, styled } from "@mui/material";


interface StyledBodyBoxProps {
  children: React.ReactNode;
}

const StyledComponent = styled(Box)(({ theme }) => ({
  width: `calc(100vw - 152px)`,
  minHeight: "calc(100vh - 72px)",
  backgroundColor: "#FFF",
  borderTopLeftRadius: 24,
  marginLeft: 32,
  [theme.breakpoints.down("xl")]: {
    width: `100vw`,
    marginLeft: 0,
  },
}));

export const StyledBodyBox: FC<StyledBodyBoxProps> = ({ children }) => {
  const { sideBarCollapse } = useSideBar();

  const getResponsiveSx = (theme: any) => ({
    [theme.breakpoints.down("xl")]: {
      width: `calc(100vw - ${sideBarCollapse ? "264px" : "152px"})`,
    },
  });

  // If sx is a function, call it with theme and merge, else merge as object
  return (
    <StyledComponent
      sx={(theme) => {
        const baseSx = getResponsiveSx(theme);
        return { ...baseSx };
      }}
    >
      {children}
    </StyledComponent>
  );
};
