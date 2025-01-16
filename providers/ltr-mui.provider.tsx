import { FC } from "react";

import { prefixer } from "stylis";
import createCache from '@emotion/cache';
import { CacheProvider } from "@emotion/react";
import { BaseProvider } from './index';
import { Box } from "@mui/material";


const cacheLtr = createCache({
  key: 'mui-ltr',
  stylisPlugins: [prefixer],
});

interface LTR_MuiProviderProps extends BaseProvider {
}

const LTR_MuiProvider: FC<LTR_MuiProviderProps> = ({ children }) => {
  return <CacheProvider value={cacheLtr}>
    <Box sx={{ direction: 'ltr' }}>
      {children}
    </Box>
  </CacheProvider>

}

export default LTR_MuiProvider