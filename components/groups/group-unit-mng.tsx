import { Dispatch, FC, SetStateAction, useState } from "react"
import { Box, Typography, Stack, Divider, Icon } from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { Group } from "@/types/interfaces/devices"
import GroupItemMng from "./group-item-mng"
import RelatedDeviceCard from "./device-item-mng"
import NoGroups from "../../assets/groups/no-groups.svg"
import NoDevices from "../../assets/groups/no-devices.svg"
import { useQ_Devices } from "@/hooks/device.query.hook"
import { useGroup, useSetChildInGroup } from "@/hooks/group.query.hook"
import { GroupResponseDto } from "@/api/src"
import { useDrop, useDrag } from "react-dnd"
import { DND_GROUP_LIST_ITEM, DND_GROUP_UNIT_ITEM } from "./dnd-constants"
import { SelectedItem } from "../pages/groups-management";
import { getGroupDropValidation } from "./group-drop-validation";

interface UnitGroupMngProps {
  group: Group
  groupsData?: GroupResponseDto
  setSelectedGroup: Dispatch<SetStateAction<SelectedItem | undefined>>
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

const UnitGroupMng: FC<UnitGroupMngProps> = ({ group, groupsData, setSelectedGroup }) => {
  const [dropReason, setDropReason] = useState<string | null>(null);

  const device = useQ_Devices()
  const qGroup = useGroup(group.id)
  const setChildInGroupMutation = useSetChildInGroup()

  const parentGroup = group.parent ? groupsData?.groups[group.parent] : null;
  const relatedGroups = group.groups
    ? group.groups
      .map(gid => groupsData?.groups[gid])
      .filter((g): g is Group => Boolean(g))
    : [];
  const relatedDevices =
    device.devices && qGroup.group?.devices
      ? qGroup.group.devices
        .map(did => device.devices?.find(d => d.id === did))
        .filter(Boolean)
      : []


  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: DND_GROUP_LIST_ITEM,
    canDrop: (item: Group) => {
      const result = getGroupDropValidation(item, group, groupsData);
      setDropReason(result.allowed ? null : result.reason || null);
      return result.allowed;
    },
    drop: (item: Group) => {
      const result = getGroupDropValidation(item, group, groupsData);
      if (!result.allowed) return;
      setChildInGroupMutation.mutate({ id: group.id, groups: [item.id] });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [group, groupsData]);


  // Add drag functionality for the current group
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_GROUP_UNIT_ITEM,
    item: group,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [group]);


  return (
    <Box sx={{ flexGrow: 1, textAlign: "center", px: 2, py: 4 }}>
      <Typography
        ref={drag}
        variant="h4"
        sx={{ fontWeight: 700, mb: 1, opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
      >
        {group.name}
      </Typography>

      {parentGroup && (
        <Stack spacing={1.5} alignItems="center" mt={2}>
          <ArrowDownwardIcon
            sx={{
              fontSize: 32,
              color: "primary.main",
              mb: -1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
              background: 'white',
              borderRadius: '50%',
              border: '2px solid #e0e0e0',
              p: 0.5
            }}
          />
          <GroupItemMng
            group={parentGroup}
            groupsData={groupsData}
            setSelectedGroup={setSelectedGroup}
            type="parent"
            onRemove={() => setChildInGroupMutation.mutate({ id: group.id, parent: null })}
          />
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Related Groups */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        קבוצות קשורות
      </Typography>
      <Stack ref={drop} direction="column" spacing={2} flexWrap="wrap" justifyContent="center">
        {(isOver && !canDrop && dropReason) && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {dropReason}
          </Typography>
        )}
        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
          {relatedGroups.length > 0 ? (
            relatedGroups.map(g => <GroupItemMng
              key={g.id}
              group={g}
              setSelectedGroup={setSelectedGroup}
              onRemove={() => setChildInGroupMutation.mutate({ id: g.id, parent: null })}
            />)
          ) : (
            <NoItemsMessage icon={<NoGroups />} message="לא קיימות קבוצות קשורות" />
          )}
        </Stack>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Related Devices */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        אמצעים קשורים
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
        {relatedDevices.length > 0 ? (
          relatedDevices.map(dvc => (
            <RelatedDeviceCard key={dvc!.id} deviceId={dvc!.id} setSelectedDevice={setSelectedGroup as any} />
          ))
        ) : (
          <NoItemsMessage icon={<NoDevices />} message="לא קיימים אמצעים קשורים" />
        )}
      </Stack>
    </Box>
  )
}

export default UnitGroupMng
