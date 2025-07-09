import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material"
import { Dispatch, FC, SetStateAction } from "react"
import NoMaps from "../../assets/maps/no-maps.svg";
import { DeviceDto } from "@/api/src";
import DeviceItem from "./device-list-item";
import { SelectedItem } from "../pages/groups-management";

interface DeviceListProps {
  devices?: DeviceDto[],
  selectedDevice: SelectedItem | undefined
  setSelectedDevice: Dispatch<SetStateAction<SelectedItem | undefined>>
  expanded: boolean;
  onExpand: () => void;
}

const DeviceList: FC<DeviceListProps> = ({ devices, selectedDevice, setSelectedDevice, expanded, onExpand }) => {

  return (
    <Accordion expanded={expanded} onChange={onExpand}>
      <AccordionSummary>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} px={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>בחר אמצעי</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {/* {devices && <DeviceList devices={devices} />} */}
        <Box>
          <Box sx={{ px: 4 }}>
            {devices && devices.length > 0
              ? devices?.map(dvc =>
                <DeviceItem
                  key={dvc.id}
                  device={dvc}
                  selectedDevice={selectedDevice}
                  setSelectedDevice={setSelectedDevice}
                />
              )
              : <Box sx={{ textAlign: "center" }}>
                <NoMaps />
                <Box>Empty state</Box>
              </Box>}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default DeviceList;