import { FC } from "react";

import { prefixer } from "stylis";
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from "@emotion/react";
import { BaseProvider } from './index';


const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

interface TLS_MuiProviderProps extends BaseProvider {
}

const TLS_MuiProvider: FC<TLS_MuiProviderProps> = ({ children }) => {
  return <CacheProvider value={cacheRtl}>
    {children}
  </CacheProvider>

}

export default TLS_MuiProvider