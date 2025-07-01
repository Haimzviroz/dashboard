import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Button, Checkbox, ListItemText } from '@mui/material';
import { Device } from '@/types/interfaces/devices';
import { DeviceTypeDto } from '@/api/src';

export interface AssignDeviceDialogProps {
  open: boolean;
  deviceTypes: DeviceTypeDto[];
  selectedDeviceTypes: number[];
  setSelectedDeviceTypes: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  onAssign: () => void;
}

const AssignDeviceDialog: React.FC<AssignDeviceDialogProps> = ({ open, deviceTypes, selectedDeviceTypes, setSelectedDeviceTypes, onClose, onAssign }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Device Types to Platform</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Device Types</InputLabel>
          <Select
            multiple
            value={selectedDeviceTypes}
            onChange={(e) => setSelectedDeviceTypes(e.target.value as number[])}
            label="Select Device Types"
            renderValue={(selected) =>
              selected.map((id) => deviceTypes.find((dt) => dt.id === id)?.name).join(', ')
            }
          >
            {deviceTypes
              .map((deviceType) => (
                <MenuItem key={deviceType.id} value={deviceType.id}>
                  <Checkbox checked={selectedDeviceTypes.indexOf(deviceType.id) > -1} />
                  <ListItemText primary={deviceType.name} secondary={deviceType.description} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onAssign}
          variant="contained"
          disabled={selectedDeviceTypes.length === 0}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDeviceDialog;
