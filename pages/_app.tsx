
import { AppPropsWithLayout } from '@/types/types';

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useState } from 'react';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastProvider } from '@/providers/toast.provider';


export default function App({ Component, pageProps: { session, ...pageProps }, router }: AppPropsWithLayout) {

  const getLayout = Component.getLayout ?? ((page) => page)

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  }));


  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <ToastProvider>
            <div className="main-div">
              <div className="main-container">
                {getLayout(<Component {...pageProps} />)}
              </div>
            </div>
          </ToastProvider>
        </HydrationBoundary>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  );
}
