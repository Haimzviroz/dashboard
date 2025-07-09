import { Dispatch, FC, SetStateAction } from "react"
import { Box, Typography, Stack, Paper, Divider, Icon, IconButton, Tooltip } from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Group } from "@/types/interfaces/devices"
import GroupItemMng from "./group-item-mng"
import RelatedDeviceCard from "./device-item-mng"
import NoGroups from "../../assets/groups/no-groups.svg"
import NoDevices from "../../assets/groups/no-devices.svg"
import { useQ_Devices } from "@/hooks/device.query.hook"
import { useGroup, useSetChildInGroup } from "@/hooks/group.query.hook"
import { GroupResponseDto } from "@/api/src"
import { useDrop } from "react-dnd"
import { DND_GROUP_LIST_ITEM } from "./dnd-constants"
import { SelectedItem } from "../pages/groups-management";

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


  const [, drop] = useDrop({
    accept: DND_GROUP_LIST_ITEM,
    canDrop(item, monitor) {
      return isGroupAllowedToDrop(item);
    },
    drop: (item: Group) => {
      if (!isGroupAllowedToDrop(item)) return;
      const currentGroups = group.groups ? group.groups.map(String) : [];
      if (!currentGroups.includes(String(item.id))) {
        setChildInGroupMutation.mutate({
          id: group.id,
          groups: [item.id]
        });
      }
    },
  })

  const isGroupAllowedToDrop = (item: Group) => {
    const notParent = (item: Group, group: Group): boolean => {
      if (!group.parent) return true;
      if (group.parent === item.id) return false;
      return group.parent && groupsData?.groups[group.parent] ? notParent(item, groupsData?.groups[group.parent]) : true;
    };
    const notSelf = item.id !== group.id;
    const notChild = item.parent !== group.id;

    return notSelf && notChild && notParent(item, group);
  };

  return (
    <Box sx={{ flexGrow: 1, textAlign: "center", px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
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
      <Stack ref={drop} direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
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
