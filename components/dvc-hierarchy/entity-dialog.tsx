import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface EntityForm {
  name: string;
  description: string;
}

interface EntityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  entityForm: EntityForm;
  setEntityForm: React.Dispatch<React.SetStateAction<EntityForm>>;
  mode: 'create' | 'edit';
  entityType: 'platform' | 'deviceType';
}

const EntityDialog: React.FC<EntityDialogProps> = ({
  open,
  onClose,
  onSubmit,
  entityForm,
  setEntityForm,
  mode,
  entityType
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create'
          ? `Create ${entityType === 'platform' ? 'Platform' : 'Device Type'}`
          : `Edit ${entityType === 'platform' ? 'Platform' : 'Device Type'}`}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={entityType === 'platform' ? 'Platform Name' : 'Device Type Name'}
          fullWidth
          variant="outlined"
          value={entityForm.name}
          onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={entityForm.description}
          onChange={(e) => setEntityForm({ ...entityForm, description: e.target.value })}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!entityForm.name.trim()}
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntityDialog;
