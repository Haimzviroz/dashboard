import { Box, Divider, Icon, Stack, Typography } from "@mui/material"
import { FC, Fragment } from "react"
import { Group } from "@/types/interfaces/devices";
import ArrowLeft from "../../assets/arrows/arrow-narrow-left.svg";
import NoGroups from "../../assets/groups/no-groups.svg";
import NoDevices from "../../assets/groups/no-devices.svg";
import GroupItemMng from "./group-item-mng";
import DvcItemMng from "./device-item-mng";
import { useQ_Devices } from "@/hooks/device.query.hook";
import { useGroup } from "@/hooks/group.query.hook";
import { GroupResponseDto } from "@/api/src";

interface UnitGroupMngProps {
  group: Group,
  groupsData?: GroupResponseDto
  // selectedGroup: Group | undefined
  // setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>
}

const UnitGroupMng: FC<UnitGroupMngProps> = ({ group, groupsData }) => {
  const device = useQ_Devices()
  const qGroup = useGroup(group.id)

  return (
    <Box sx={{ flexGrow: 1, m: 0, textAlign: "left" }}>
      <Typography variant="h3" sx={{ fontWeight: 600, px: 3, py: 3 }}>{group.name}</Typography>
      <Stack direction={"row"} justifyContent={"space-evenly"} mb={5}>
        <GroupItemMng group={group} groupsData={groupsData}></GroupItemMng>
        {group.parent && groupsData?.groups[group.parent] &&
          <Fragment>
            <Box sx={{ alignSelf: "center" }}>
              <ArrowLeft></ArrowLeft>
            </Box>
            <GroupItemMng group={groupsData?.groups[group.parent]} groupsData={groupsData} type="parent"></GroupItemMng>
          </Fragment>}
      </Stack>
      <Typography variant="h6" sx={{ fontWeight: 600, px: 3, py: 3 }}>קבוצות קשורות</Typography>
      <Divider />
      <Stack direction={"row"} gap={2} px={3} justifyContent={"center"}>

        {group.groups
          ? group.groups?.map(g =>
            groupsData?.groups[g] ? (
              <GroupItemMng key={g} group={groupsData.groups[g]} />
            ) : null
          )
          : <Box p={2}>
            <Stack direction={"column"} justifyContent={"center"}>
              <Icon sx={{ width: 72, height: 72, alignSelf: "center" }}>
                <NoGroups></NoGroups>
              </Icon>
              <Typography variant="caption" sx={{ fontWeight: 600, alignSelf: "center" }}>לא קיימת קבוצות קשורות</Typography>
            </Stack>
          </Box>}
      </Stack>
      <Typography variant="h6" sx={{ fontWeight: 600, px: 3, py: 3 }}>אמצעים קשורים</Typography>
      <Divider />
      <Stack direction={"row"} gap={2} px={3} justifyContent={"center"}>

        {device.devices && qGroup.group?.devices ? qGroup.group.devices.map(d => {
          const dvc = device.devices?.find(dvc => dvc.id == d)
          return dvc ? <DvcItemMng device={dvc} /> : null
        })
          : <Box p={2}>
            <Stack direction={"column"} justifyContent={"center"}>
              <Icon sx={{ width: 120, height: 120, alignSelf: "center" }}>
                <NoDevices></NoDevices>
              </Icon>
              <Typography variant="caption" sx={{ fontWeight: 600, alignSelf: "center" }}>לא קיימים אמצעיים קשורים</Typography>
            </Stack>
          </Box>}
      </Stack>

    </Box>
  )
}

export default UnitGroupMng;