import { FC } from "react"
import { Box, Typography, Stack, Paper, Divider, Icon } from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { Group } from "@/types/interfaces/devices"
import GroupItemMng from "./group-item-mng"
import DvcItemMng from "./device-item-mng"
import NoGroups from "../../assets/groups/no-groups.svg"
import NoDevices from "../../assets/groups/no-devices.svg"
import { useQ_Devices } from "@/hooks/device.query.hook"
import { useGroup, useSetChildInGroup } from "@/hooks/group.query.hook"
import { GroupResponseDto } from "@/api/src"
import { useDrop } from "react-dnd"
import { DND_GROUP_TYPE } from "./dnd-constants"

interface UnitGroupMngProps {
  group: Group
  groupsData?: GroupResponseDto
}

const NoItemsMessage: FC<{ icon: JSX.Element; message: string }> = ({ icon, message }) => (
  <Box p={3}>
    <Stack alignItems="center" spacing={1}>
      <Icon sx={{ width: 120, height: 90, alignSelf: "center" }}>{icon}</Icon>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {message}
      </Typography>
    </Stack>
  </Box>
)

const UnitGroupMng: FC<UnitGroupMngProps> = ({ group, groupsData }) => {
  const device = useQ_Devices()
  const qGroup = useGroup(group.id)
  const setChildInGroupMutation = useSetChildInGroup()

  const parentGroup = group.parent ? groupsData?.groups[group.parent] : null
  const relatedGroups = group.groups?.map(gid => groupsData?.groups[gid]).filter(Boolean) || []
  const relatedDevices =
    device.devices && qGroup.group?.devices
      ? qGroup.group.devices
        .map(did => device.devices?.find(d => d.id === did))
        .filter(Boolean)
      : []

  // DnD drop for related groups
  const [, drop] = useDrop({
    accept: DND_GROUP_TYPE,
    canDrop(item, monitor) {
      // TODO disable drop if the group is one of the current group parents
      const currentGroups = group.groups ? group.groups.map(Number) : [];
      return item.id !== group.id && !currentGroups.includes(item.id);
    },
    drop: (item: { id: number }) => {
      if (!item.id || item.id === group.id) return;
      const currentGroups = group.groups ? group.groups.map(String) : [];
      if (!currentGroups.includes(String(item.id))) {
        setChildInGroupMutation.mutate({
          id: group.id,
          groups: [item.id]
        });
      }
    },
  })

  return (
    <Box sx={{ flexGrow: 1, textAlign: "center", px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {group.name}
      </Typography>

      {parentGroup && (
        <Stack spacing={0.5} alignItems="center" mt={1}>
          <ArrowDownwardIcon
            sx={{
              fontSize: 28,
              color: "text.secondary",
              transform: "rotate(180deg)", // rotate to point up
            }}
          />
          <Paper
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              backgroundColor: "grey.100",
              textAlign: "center",
              width: "fit-content",
              mx: "auto",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
              תחת:
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight="medium">
              {parentGroup.name}
            </Typography>
          </Paper>
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Related Groups */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        קבוצות קשורות
      </Typography>
      <Stack ref={drop} direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
        {relatedGroups.length > 0 ? (
          relatedGroups.map(g => <GroupItemMng key={g!.id} group={g!} />)
        ) : (
          <NoItemsMessage icon={<NoGroups />} message="לא קיימות קבוצות קשורות" />
        )}
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Related Devices */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        אמצעים קשורים
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
        {relatedDevices.length > 0 ? (
          relatedDevices.map(dvc => <DvcItemMng key={dvc!.id} device={dvc!} />)
        ) : (
          <NoItemsMessage icon={<NoDevices />} message="לא קיימים אמצעים קשורים" />
        )}
      </Stack>
    </Box>
  )
}

export default UnitGroupMng
