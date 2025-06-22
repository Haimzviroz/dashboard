import { Box } from "@mui/material"
import { Dispatch, FC, SetStateAction } from "react"
import NoMaps from "../../assets/maps/no-maps.svg";
import { Group } from "@/types/interfaces/devices"
import GroupItem from "./group-item";
import { DeviceDto } from "@/api/src";
import DeviceItem from "./device-item";

interface DeviceListProps {
  devices: DeviceDto[],
  // selectedGroup: Group | undefined
  // setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>
}

const DeviceList: FC<DeviceListProps> = ({ devices }) => {

  return (
    <Box>
      <Box sx={{ px: 4 }}>
        {devices.length > 0
          ? devices?.map(dvc =>
            <DeviceItem key={dvc.id} device={dvc} />
          )
          : <Box sx={{ textAlign: "center" }}>
            <NoMaps />
            <Box>Empty state</Box>
          </Box>}
      </Box>
    </Box>
  )
}

export default DeviceList;