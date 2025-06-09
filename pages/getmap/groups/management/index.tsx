import GM_layout from "@/components/layout/GM-layout";
import GroupMngPage from "@/components/pages/groups-management";
import { NextPageWithLayout } from "@/types/types";
import { ReactElement } from "react"

interface ManageGroups {

}

const ManageGroups: NextPageWithLayout<ManageGroups> = () => {
  return (
    <GroupMngPage />
  )
}

export default ManageGroups

ManageGroups.getLayout = (page: ReactElement) => {
  return <GM_layout page={page} />
}