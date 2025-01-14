import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import { getCookie } from '@/apis/client-side/token-client.middleware';
import { Auth } from '@/types/interfaces';
import LogoMap from "../../assets/logos/logo.svg"
import LogoApp from "../../assets/logos/logo_app.svg"
import Profile from './profile/profile';
import Notification from './notifs/notifications';
import Settings from './settings/settings';
import { AppScopeEnum } from '@/types/enum';
import { R_APP_DEVICES, R_MAP_DEVICES, R_GET_APP, R_GET_MAP } from '@/apis/routes';

interface GetAppLogoProps {
  withIcons?: boolean,
  scope: AppScopeEnum
}

const GetAppLogo: FC<GetAppLogoProps> = ({ withIcons = true, scope }) => {
  const router = useRouter()

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, px: 8, height: 56 }}>
      <Stack direction='row' gap={2} alignItems={"center"}>
        {
          scope === AppScopeEnum.getapp
            ?
            <div onClick={() => router.push(R_MAP_DEVICES)}>

              <LogoApp />
              {/* <Typography variant='h5' sx={{ fontFamily: "Arial, sans-serif;", color: "#224687", fontWeight: 600 }} >Get-App</Typography> */}
            </div>
            :
            <div onClick={() => router.push(R_APP_DEVICES)}>
              <LogoMap />
            </div>
        }
      </Stack>
      {withIcons && <Box>
        <Stack direction='row' gap={2} alignItems={"center"}>
          <Settings />
          <Notification />
          <Profile />
        </Stack>
      </Box>}
    </Box>
  )
}

export default GetAppLogo


