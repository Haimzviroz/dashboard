import { Dispatch, FC, SetStateAction } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from "@mui/material";
import type { CreateDevicesGroupDto, EditDevicesGroupDto } from "@/api/src";

interface GroupDialogProps {
  mode: "create" | "edit";
  open: boolean;
  form: CreateDevicesGroupDto | EditDevicesGroupDto;
  onChange: Dispatch<SetStateAction<CreateDevicesGroupDto | EditDevicesGroupDto>>;
  onClose: () => void;
  onSave: () => void;
}

const GroupDialog: FC<GroupDialogProps> = ({ mode, open, form, onChange, onClose, onSave }) => (
  <Dialog open={open} onClose={onClose}>
    <Box sx={{ direction: "ltr" }}>
      <DialogTitle>{mode === "edit" ? "ערוך קבוצה" : "הוסף קבוצה"}</DialogTitle>
      <DialogContent>
        <TextField
          label="שם קבוצה"
          value={form.name || ""}
          onChange={e => onChange({ ...form, name: e.target.value })}
          fullWidth
          margin="normal"
          required
          error={!form.name?.trim()}
          helperText={!form.name?.trim() ? 'שדה חובה' : ''}
        />
        <TextField
          label="תיאור (אופציונלי)"
          value={form.description || ""}
          onChange={e => onChange({ ...form, description: e.target.value })}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={onSave} variant="contained" disabled={!form.name?.trim()}>{mode === "edit" ? "שמור" : "הוסף"}</Button>
      </DialogActions>
    </Box>
  </Dialog>
);

export default GroupDialog;
