import GM_layout from "@/components/layout/GM-layout";
import { NextPageWithLayout } from "@/types/types";
import { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { SS_DeviceClient } from "@/apis/server-side/ss_device-client";
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { Q_DEVICES, Q_SOFTWARE_META_DATA, Q_DIST_ENTITY, Q_GROUPS, Q_MAP_META_DATA } from "@/apis/query-keys";
import { AppScopeEnum } from "@/types/enum";
import DevicesPage from "@/components/pages/devices";
import { RouterHelpers } from "@/utils/helpers/router.helper";
import { SS_GetMapClient } from "@/apis/server-side/ss_gm-maps-client";

interface DevicesProps {
  
}

const Devices: NextPageWithLayout<DevicesProps> = () => {

  return <DevicesPage scope={AppScopeEnum.getmap} />
}

export default Devices;

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const httpClient = new SS_DeviceClient(context)
  const mapClient = new SS_GetMapClient(context)
  const queryClient = new QueryClient();
  const strGroupParam: string = RouterHelpers.strParamsByKey("groups", context.query)
  const strGroupAndMapParam: string = RouterHelpers.strParamsByKey(["groups", "map"], context.query)  
  const [type, catalogId] = RouterHelpers.strArrayByKey(["map"], context.query) ?? [null, ""];   


  try {

    const groupList = await httpClient.getGroups()
    // const devicesList = await httpClient.getAllDevices(stringParams)
    // const devicesMetaData = await httpClient.getDevicesMetaData(stringParams)

    await Promise.allSettled([
      await queryClient.prefetchQuery({
        queryKey: [Q_DEVICES, strGroupParam],
        queryFn: () => httpClient.getAllDevices(strGroupParam)
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_GROUPS],
        queryFn: () => groupList
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_MAP_META_DATA, strGroupAndMapParam],
        queryFn: () => httpClient.getDevicesMapMetaData(strGroupAndMapParam)
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_DIST_ENTITY, type],
        queryFn: () => mapClient.getMapById(Array.isArray(catalogId) ? catalogId[0] : catalogId)
      })
    ])
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        groupList
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

Devices.getLayout = (page: ReactElement) => {
  return <GM_layout page={page} />
}