import { NextPageWithLayout } from "@/types/types";
import { Accordion, AccordionDetails, AccordionSummary, Box, Icon, SxProps, Typography } from "@mui/material";
import { useGroups } from "@/hooks/group.query.hook";
import GroupList from "../groups/group-list";
import { useState } from "react";
import UnitGroupMng from "../groups/group-mng-unit";
import SelectGroup from "../../assets/groups/select-group.svg"
import { Group } from "@/types/interfaces/devices";
import DeviceList from "../groups/device-list";
import { useQ_Devices } from "@/hooks/device.query.hook";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DeviceDto } from "@/api/src";

interface DevicesProps {
  // scope: AppScopeEnum
}

export type SelectedItem = { t: "d" | "g", item: Group | DeviceDto } | undefined

const GroupMngPage: NextPageWithLayout<DevicesProps> = () => {
  const { groups: groupsData } = useGroups()
  const { devices } = useQ_Devices()
  const [selectedItem, setSelectedItem] = useState<SelectedItem>()
  const [expanded, setExpanded] = useState<string>()

  const style: SxProps = {
    width: 400,
    minHeight: "calc(100vh - 100px)",
    overflowY: "auto",
    pt: 3,
    borderRightColor: "#00000020",
    borderRightStyle: "solid",
    borderRightWidth: "thin",
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      background: "#FFFFFF",
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#DBE1EC',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#9fb1d1'
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>


      <Box sx={{ display: "flex" }}>
        <Box sx={style}>
          <GroupList
            groups={groupsData ? Object.values(groupsData.groups) : []}
            selectedGroup={selectedItem}
            setSelectedGroup={setSelectedItem}
            expanded={expanded === "g"}
            onExpand={() => expanded != "g" ? setExpanded("g") : setExpanded(undefined)}
          />
          <Accordion expanded={expanded === "d"} onChange={() => expanded != "d" ? setExpanded("d") : setExpanded(undefined)}>
            <AccordionSummary>
              <Typography variant="h5" sx={{ fontWeight: 600, py: 2, px: 1 }}>בחר אמצעי</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {devices && <DeviceList devices={devices} />}
            </AccordionDetails>
          </Accordion>
        </Box>
        {selectedItem && <UnitGroupMng
          group={groupsData?.groups[selectedItem.item.id]} // always fresh from source
          groupsData={groupsData}
          setSelectedGroup={setSelectedItem}
        />
        }
        {!selectedItem && <Box sx={{ mt: 32, height: "calc(100vh - 100px)", flexGrow: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Icon sx={{ height: 120, width: 160 }}>
              <SelectGroup />
            </Icon>
            <Typography variant="body2" textAlign={"center"}>בחר קבוצה או אמצעי </Typography>
          </Box>
        </Box>}
      </Box>
    </DndProvider>
  )
}

export default GroupMngPage;