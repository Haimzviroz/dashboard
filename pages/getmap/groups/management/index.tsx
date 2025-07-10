import { Q_GROUPS, Q_ORG_DEVICES } from "@/apis/query-keys";
import { SS_DeviceClient } from "@/apis/server-side/ss_device-client";
import GM_layout from "@/components/layout/GM-layout";
import GroupMngPage from "@/components/pages/groups-management";
import { NextPageWithLayout } from "@/types/types";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react"

interface ManageGroups {

}

const ManageGroups: NextPageWithLayout<ManageGroups> = () => {
  return (
    <GroupMngPage />
  )
}

export default ManageGroups

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const httpClient = new SS_DeviceClient(context)
  const queryClient = new QueryClient();

  try {

    const groupList = await httpClient.getGroups()

    await Promise.allSettled([
      await queryClient.fetchQuery({
        queryKey: [Q_GROUPS],
        queryFn: () => groupList
      }),
      await queryClient.fetchQuery({
        queryKey: [Q_ORG_DEVICES],
        queryFn: () => httpClient.getOrgDevices()
      }),
    ])
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

ManageGroups.getLayout = (page: ReactElement) => {
  return <GM_layout page={page} />
}