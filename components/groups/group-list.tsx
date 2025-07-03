import { Box, Typography, Tooltip, IconButton, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material"
import { Dispatch, FC, SetStateAction, useState } from "react"
import NoMaps from "../../assets/maps/no-maps.svg";
import { Group } from "@/types/interfaces/devices"
import GroupItem from "./group-item";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCreateGroup } from "@/hooks/group.query.hook";
import GroupDialog from "./group-dialog";
import type { CreateDevicesGroupDto, EditDevicesGroupDto } from "@/api/src/api";

interface GroupListProps {
  groups?: Group[],
  selectedGroup: Group | undefined
  setSelectedGroup: Dispatch<SetStateAction<Group | undefined>>
  expanded: boolean;
  onExpand: () => void;
}

const GroupList: FC<GroupListProps> = ({ groups, selectedGroup, setSelectedGroup, expanded, onExpand }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateDevicesGroupDto>({ name: "" });

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
    if (!form.name?.trim()) return;
    createGroupMutation.mutate({ name: form.name, description: form.description });
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
      {/* Create/Edit Group Dialog */}
      <GroupDialog
        mode={"create"}
        open={dialogOpen}
        form={form}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        onChange={(newForm) => setForm(newForm as CreateDevicesGroupDto)}
      />
    </Accordion>
  )
}

export default GroupList;