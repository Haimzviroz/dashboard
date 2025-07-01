import React, { ReactElement } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid, Paper, Divider } from '@mui/material';

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


const OrganizationalStructurePage: NextPageWithLayout = () => {
  const { platforms } = usePlatforms();
  const { deviceTypes } = useDeviceTypes();
  const loading = !platforms || !deviceTypes;

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

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              Platform Management
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <PlatformManager platforms={platforms} deviceTypes={deviceTypes} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom color="secondary">
              Device Types
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <DeviceTypeManager deviceTypes={deviceTypes} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

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
        platforms,
        deviceTypes
      }
    };
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error);
  }
}

OrganizationalStructurePage.getLayout = (page: ReactElement) => {
  return <GA_layout page={<LTR_MuiProvider>{page}</LTR_MuiProvider>} />
}
