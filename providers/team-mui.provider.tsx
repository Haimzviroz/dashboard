import { FC } from "react";

import { BaseProvider } from './index';
import { ThemeProvider, createTheme } from "@mui/material";


const theme = createTheme({
  direction: "rtl"
})

interface TeamMuiProviderProps extends BaseProvider {
}

const TeamMuiProvider: FC<TeamMuiProviderProps> = ({ children }) => {
  return <ThemeProvider theme={theme} >
    {children}
  </ThemeProvider>

}

export default TeamMuiProvider