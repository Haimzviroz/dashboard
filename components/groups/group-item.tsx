import { Box, Card, CardContent, Icon, Stack, SxProps, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { Group } from "@/types/interfaces/devices";
import GroupIcon from "../../assets/side-bar/group.svg";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDeleteGroup, useUpdateGroup } from "@/hooks/group.query.hook";
import type { EditDevicesGroupDto } from "@/api/src/api";

interface GroupItemProps {
  group: Group,
  selectedGroup: Group | undefined
  setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>

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
      variant="outlined"
      sx={{
        borderRadius: 2,
        my: .5,
        backgroundColor: selectedGroup?.id === group.id ? '#e0f7fa' : 'white',
        cursor: 'pointer',
        borderColor: selectedGroup?.id === group.id ? '#00acc1' : 'rgba(0, 0, 0, 0.12)',
      }}
    >
      <Box onClick={() => setSelectedGroup(group)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardContent sx={{ flex: 1 }}>
          <Stack direction={"row"} gap={1} alignItems="center">
            <Icon>
              <GroupIcon />
            </Icon>
            <Typography>{group.name}</Typography>
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
      {/* Edit Group Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <Box sx={{ direction: "ltr" }}>

          <DialogTitle>ערוך קבוצה</DialogTitle>
          <DialogContent>
            <TextField
              label="שם קבוצה"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              fullWidth
              margin="normal"
              required
              error={!form?.name?.trim()}
              helperText={!form?.name?.trim() ? 'שדה חובה' : ''}
            />
            <TextField
              label="תיאור (אופציונלי)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleEditClose}>ביטול</Button>
            <Button onClick={handleEditSave} variant="contained" disabled={!form?.name?.trim()}>שמור</Button>
          </DialogActions>
        </Box>
      </Dialog>
      {/* Delete Group Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <Box sx={{ direction: "ltr" }}>

          <DialogTitle>מחיקת קבוצה</DialogTitle>
          <DialogContent>
            <Typography>האם אתה בטוח שברצונך למחוק את הקבוצה "{group.name}"?</Typography>
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