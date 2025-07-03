import { Q_GROUPS } from "@/apis/query-keys";
import { SS_DeviceClient } from "@/apis/server-side/ss_device-client";
import GA_layout from "@/components/layout/GA-layout";
import GroupMngPage from "@/components/pages/groups-management";
import { NextPageWithLayout } from "@/types/types";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react"
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ManageGroups {

}

const ManageGroups: NextPageWithLayout<ManageGroups> = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <GroupMngPage />
    </DndProvider>
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
  return <GA_layout page={page} />
}