import { NextPageWithLayout } from "@/types/types";
import DevicesTable from "@/components/devices/table-devices";
import BodyBox from "@/components/body/body-box";
import { useDistEntity, useQ_Devices } from "@/hooks/device.query.hook";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import DeviceMetaData from "@/components/devices/device-info";
import { AppScopeEnum } from "@/types/enum";
import { useState } from "react";
import { InfoItemName } from "../devices/device-info-item";
import GroupSelectionProvider from "@/providers/group-selection.provider";

interface DevicesProps {
  scope: AppScopeEnum
}

const DevicesPage: NextPageWithLayout<DevicesProps> = ({ scope }) => {
  const router = useRouter()

  const devices = useQ_Devices(router.query.groups)
  const distEntity = useDistEntity(router.query.software ? ["software", router.query.software] : router.query.maps ? ["map", router.query.maps] : undefined)

  const [currentDevices, setCurrentDevices] = useState<string[]>()
  const [activeItem, setActiveItem] = useState<InfoItemName | undefined>()


  const getFilteredDevices = () => {
    if (devices && currentDevices) {
      return devices.devices?.filter(d => currentDevices.includes(d.id))
    }
  }

  return (
    <GroupSelectionProvider>
      <BodyBox >
        <Box sx={(theme) => ({
          flexGrow: 1, mx: 15, mt: 5,
          // flexGrow: 1, mx: 15, mt: 5, height: "calc(100vh - 112px)", overflow: "hidden",
          [theme.breakpoints.down("xl")]: {
            mx: 7.5
          }
        })}>
          <Typography variant="h4" sx={{ fontWeight: 600, px: 0, pb: 3 }}>אמצעי קצה</Typography>
          <DeviceMetaData router={router} scope={scope} cEntity={distEntity.dEntity} activeItem={activeItem} setActiveItem={setActiveItem} setCurrentDevices={setCurrentDevices} />
          {devices.devices && <DevicesTable mode="page" devices={getFilteredDevices() ?? devices.devices} scope={scope} dEntity={distEntity.dEntity}></DevicesTable>}
        </Box>
      </BodyBox>
    </GroupSelectionProvider>
  )
}

export default DevicesPage;