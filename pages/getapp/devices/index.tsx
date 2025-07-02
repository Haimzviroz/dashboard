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
  const catalogId = Array.isArray(context.query.software) ? context.query.software[0] : context.query.software ?? ""

  try {

    const groupList = await httpClient.getGroups()
    // const devicesList = await httpClient.getAllDevices(stringParams)
    // const devicesMetaData = await httpClient.getDevicesMetaData(stringParams)

    await Promise.allSettled([
      await queryClient.prefetchQuery({
        queryKey: [Q_DEVICES, "groups", context.query.groups ?? null],
        queryFn: () => httpClient.getAllDevices(context.query.groups)
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_GROUPS],
        queryFn: () => groupList
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_SOFTWARE_META_DATA, "groups", context.query.groups ?? null, "software", context.query.software ?? null],
        queryFn: () => httpClient.getDevicesSoftwareMetaData(context.query.groups, context.query.software)
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_DIST_ENTITY, "software"],
        queryFn: catalogId ? () => softwareClient.getSoftWareById(catalogId) : async () => Promise.resolve()
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
  return <GA_layout page={page} withGroups={true} />
}