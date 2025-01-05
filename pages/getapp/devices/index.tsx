import { NextPageWithLayout } from "@/types/types";
import { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { SS_DeviceClient } from "@/apis/server-side/ss_device-client";
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { Q_DEVICES, Q_SOFTWARE_META_DATA, Q_DIST_ENTITY, Q_GROUPS } from "@/apis/query-keys";
import GA_layout from "@/components/layout/GA-layout";
import { AppScopeEnum } from "@/types/enum";
import DevicesPage from "@/components/pages/devices";
import { RouterHelpers } from "@/utils/helpers/router.helper";
import { SS_SoftwareClient } from "@/apis/server-side/ss_software-client";

interface DevicesProps {

}

const Devices: NextPageWithLayout<DevicesProps> = () => {

  return <DevicesPage scope={AppScopeEnum.getapp} />
}

export default Devices;

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const httpClient = new SS_DeviceClient(context)
  const softwareClient = new SS_SoftwareClient(context)
  const queryClient = new QueryClient();
  const strGroupParam: string = RouterHelpers.strParamsByKey("groups", context.query)
  const strGroupAndSoftwareParam: string = RouterHelpers.strParamsByKey(["groups", "software"], context.query)
  const [type, catalogId] = RouterHelpers.strArrayByKey(["software"], context.query) ?? [null, ""]; 


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
        queryKey: [Q_SOFTWARE_META_DATA, strGroupAndSoftwareParam],
        queryFn: () => httpClient.getDevicesSoftwareMetaData(strGroupAndSoftwareParam)
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_DIST_ENTITY, type],
        queryFn: () => softwareClient.getSoftWareById(Array.isArray(catalogId) ? catalogId[0] : catalogId)
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
  return <GA_layout page={page} />
}