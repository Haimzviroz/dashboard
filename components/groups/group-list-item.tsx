import { Box, Card, CardContent, Icon, Stack, SxProps, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { Group } from "@/types/interfaces/devices";
import GroupIcon from "../../assets/side-bar/group.svg";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDeleteGroup, useUpdateGroup, useSetChildInGroup } from "@/hooks/group.query.hook";
import type { EditDevicesGroupDto } from "@/api/src/api";
import GroupDialog from "./group-dialog";
import { useDrag, useDrop } from "react-dnd";
import { DND_GROUP_LIST_ITEM, DND_GROUP_UNIT_ITEM } from "./dnd-constants";
import { SelectedItem } from "../pages/groups-management";

interface GroupItemProps {
  group: Group,
  selectedGroup: SelectedItem | undefined
  setSelectedGroup: Dispatch<SetStateAction<SelectedItem | undefined>>
}

const boxStyle: SxProps = {
  border: 1,
  borderColor: "#DBE1EC",
  borderRadius: 2,
  my: 1,
  padding: 2,
  marginRight: .5,
  width: 300,
  cursor: "pointer"
}

const GroupItem: FC<GroupItemProps> = ({ group, selectedGroup, setSelectedGroup }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState<EditDevicesGroupDto>({ name: group.name, description: group.description });
  const deleteGroupMutation = useDeleteGroup();
  const updateGroupMutation = useUpdateGroup();
  const setChildInGroup = useSetChildInGroup();

  // Make this group draggable
  const [{ isDragging }, drag] = useDrag({
    type: DND_GROUP_LIST_ITEM,
    item: group,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Make this group a drop target for other groups
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DND_GROUP_UNIT_ITEM,
    canDrop: (item: Group) => item.id !== group.id && item.parent !== group.id,
    drop: async (item: Group) => {
      if (item.id !== group.id && item.parent !== group.id) {
        setChildInGroup.mutate({ id: item.id, parent: group.id });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({ name: group.name, description: group.description });
    setEditDialogOpen(true);
  };
  const handleEditSave = async () => {
    if (!form?.name?.trim()) return;
    await updateGroupMutation.mutateAsync({ id: group.id, data: { name: form.name, description: form.description } });
    setEditDialogOpen(false);
  };
  const handleEditClose = () => setEditDialogOpen(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    await deleteGroupMutation.mutateAsync(group.id);
    setDeleteDialogOpen(false);
  };
  const handleDeleteClose = () => setDeleteDialogOpen(false);

  return (
    <Card
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      variant="outlined"
      sx={{
        borderRadius: 2,
        my: .5,
        backgroundColor: isOver && canDrop ? '#b2ebf2' : selectedGroup?.item?.id === group.id ? '#e0f7fa' : 'white',
        cursor: 'pointer',
        borderColor: selectedGroup?.item?.id === group.id ? '#00acc1' : 'rgba(0, 0, 0, 0.12)',
        boxShadow: isOver && canDrop ? 4 : undefined,
      }}
    >
      <Box onClick={() => setSelectedGroup({ t: "g", item: group })} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardContent sx={{ flex: 1 }}>
          <Stack direction={"row"} gap={1} alignItems="center">
            <Icon>
              <GroupIcon />
            </Icon>
            <Stack direction={"column"} gap={0.5} alignItems="flex-start">
              <Typography fontWeight={600}>{group.name}</Typography>
              {group.description && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0 }}>
                  {group.description}
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
          <Tooltip title="ערוך קבוצה">
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="מחק קבוצה">
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <GroupDialog
        mode={"edit"}
        open={editDialogOpen}
        form={form}
        onClose={handleEditClose}
        onSave={handleEditSave}
        onChange={setForm} />
      {/* Delete Group Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <Box sx={{ direction: "ltr" }}>

          <DialogTitle>מחיקת קבוצה</DialogTitle>
          <DialogContent>
            <Typography>{`האם אתה בטוח שברצונך למחוק את הקבוצה '${group.name}'?`}</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleDeleteClose}>ביטול</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">מחק</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Card>
  );
}

export default GroupItem;