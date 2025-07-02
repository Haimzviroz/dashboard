import React, { ReactElement } from 'react';
import { Box, Typography, CircularProgress, Paper, Divider } from '@mui/material';

import { Q_PLATFORMS, Q_DEVICE_TYPES } from '@/apis/query-keys';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types/layout.type';
import GA_layout from '@/components/layout/GA-layout';
import { SS_HierarchyClient } from '@/apis/server-side/ss_hierarchy-client';
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import { useDeviceTypes, usePlatforms } from '@/hooks/dvc-hierarchy.query.hook';
import PlatformManager from '@/components/dvc-hierarchy/platform-manager';
import DeviceTypeManager from '@/components/dvc-hierarchy/device-type-manager';
import ResizableGrid from '@/components/utils/resizable-grid';


const OrganizationalStructurePage: NextPageWithLayout = () => {
  const { platforms } = usePlatforms();
  const { deviceTypes } = useDeviceTypes();
  const loading = !platforms || !deviceTypes;

  const [showLeft, setShowLeft] = React.useState(true);
  const [showRight, setShowRight] = React.useState(true);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading organizational structure...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" gap={2} mb={2}>
        <button
          style={{ padding: '6px 16px', borderRadius: 4, border: 0, background: showLeft ? '#1976d2' : '#fff', color: showLeft ? '#fff' : '#1976d2', cursor: 'pointer' }}
          onClick={() => {
            if (showLeft) {
              setShowLeft(false);
              setShowRight(true);
            } else {
              setShowLeft(true);
            }
          }}
        >
          {showLeft ? 'Hide Platform Management' : 'Show Platform Management'}
        </button>
        <button
          style={{ padding: '6px 16px', borderRadius: 4, border: 0, background: showRight ? '#9c27b0' : '#fff', color: showRight ? '#fff' : '#9c27b0', cursor: 'pointer' }}
          onClick={() => {
            if (showRight) {
              setShowRight(false);
              setShowLeft(true);
            } else {
              setShowRight(true);
            }
          }}
        >
          {showRight ? 'Hide Device Types' : 'Show Device Types'}
        </button>
      </Box>
      <ResizableGrid
        left={showLeft ? (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <PlatformManager platforms={platforms} deviceTypes={deviceTypes} />
          </Paper>
        ) : null}
        right={showRight ? (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <DeviceTypeManager deviceTypes={deviceTypes} />
          </Paper>
        ) : null}
        minLeft={320}
        minRight={320}
      />
    </Box>
  );
}

export default OrganizationalStructurePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const httpClient = new SS_HierarchyClient(context);
  const queryClient = new QueryClient();
  try {
    const platforms = await httpClient.getPlatforms();
    const deviceTypes = await httpClient.getDeviceTypes();
    await Promise.allSettled([
      queryClient.fetchQuery({
        queryKey: [Q_PLATFORMS],
        queryFn: () => platforms
      }),
      queryClient.fetchQuery({
        queryKey: [Q_DEVICE_TYPES],
        queryFn: () => deviceTypes
      })
    ]);
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      }
    };
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error);
  }
}

OrganizationalStructurePage.getLayout = (page: ReactElement) => {
  return <GA_layout page={<LTR_MuiProvider>{page}</LTR_MuiProvider>} />
}
