import { Box, Typography, Tooltip, IconButton, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material"
import { Dispatch, FC, SetStateAction, useState } from "react"
import NoMaps from "../../assets/maps/no-maps.svg";
import { Group } from "@/types/interfaces/devices"
import GroupItem from "./group-item";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCreateGroup } from "@/hooks/group.query.hook";
import { CreateDevicesGroupDto } from "@/api/src";

interface GroupListProps {
  groups?: Group[],
  selectedGroup: Group | undefined
  setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>
  expanded: boolean;
  onExpand: () => void;
}

const GroupList: FC<GroupListProps> = ({ groups, selectedGroup, setSelectedGroup, expanded, onExpand }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateDevicesGroupDto>({ name: "", description: "" });

  // Add group mutation
  const createGroupMutation = useCreateGroup();

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setForm({ name: '', description: '' });
    setDialogOpen(false);
  };

  const handleDialogSave = async () => {
    if (!form.name?.trim()) return; // Optionally prevent empty names
    createGroupMutation.mutate(form);
    setForm({ name: '', description: '' });
    setDialogOpen(false);
  };

  return (
    <Accordion expanded={expanded} onChange={() => onExpand()}>
      <AccordionSummary>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} px={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>בחר קבוצה</Typography>
          <Tooltip title="Add Group">
            <IconButton color="primary" size="small" sx={{ ml: 1 }} onClick={handleAddClick}>
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ px: 2 }}>
          {(groups && groups.length > 0)
            ? groups.map(group =>
              <Box key={group.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <GroupItem
                    group={group}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                  />
                </Box>
              </Box>
            )
            : <Box sx={{ textAlign: "center" }}>
              <NoMaps />
              <Box>Empty state</Box>
            </Box>}
        </Box>
      </AccordionDetails>
      {/* Add Group Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box sx={{ direction: "ltr" }}>
          <DialogTitle>הוסף קבוצה</DialogTitle>
          <DialogContent>
            <TextField
              label="שם קבוצה"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              fullWidth
              margin="normal"
              required
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
          <DialogActions sx={{px:3, py:2}}>
            <Button onClick={handleDialogClose}>ביטול</Button>
            <Button onClick={handleDialogSave} variant="contained" disabled={!form.name.trim()}>שמור</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Accordion>
  )
}

export default GroupList;