import React, { useState } from 'react';
import { Button, Grid, Paper, IconButton, Tooltip, Typography, Box, Stack, Alert } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import EntityDialog from './entity-dialog';
import { useCreateDeviceType, useUpdateDeviceType, useDeleteDeviceType } from '@/hooks/dvc-hierarchy.query.hook';
import { DeviceTypeDto } from '@/api/src';

interface DeviceTypeManagerProps {
  deviceTypes: DeviceTypeDto[];
}

const DeviceTypeManager: React.FC<DeviceTypeManagerProps> = ({ deviceTypes }) => {
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; data: DeviceTypeDto | null }>({ open: false, mode: 'create', data: null });
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  const createDeviceType = useCreateDeviceType();
  const updateDeviceType = useUpdateDeviceType();
  const deleteDeviceType = useDeleteDeviceType();

  const openDialog = (mode: 'create' | 'edit', deviceType?: DeviceTypeDto) => {
    setDialog({ open: true, mode, data: deviceType || null });
    setForm(deviceType ? { name: deviceType.name, description: deviceType.description ?? '' } : { name: '', description: '' });
  };

  const handleClose = () => {
    setDialog({ open: false, mode: 'create', data: null });
    setForm({ name: '', description: '' });
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      if (dialog.mode === 'create') {
        await createDeviceType.mutateAsync(form);
      } else if (dialog.data) {
        await updateDeviceType.mutateAsync({ id: dialog.data.id, dto: form });
      }
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDeviceType.mutateAsync(id);
    } catch (err: any) {
      setError(err?.message || 'Delete failed');
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Device Types</Typography>
        <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => openDialog('create')}>
          Add Type
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      <Grid container spacing={2}>
        {deviceTypes.map((deviceType) => (
          <Grid item xs={12} key={deviceType.id}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>{deviceType.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{deviceType.description}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit Device Type">
                    <IconButton size="small" onClick={() => openDialog('edit', deviceType)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Device Type">
                    <IconButton size="small" onClick={() => handleDelete(deviceType.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <EntityDialog
        open={dialog.open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        entityForm={form}
        setEntityForm={setForm}
        mode={dialog.mode}
        entityType="deviceType"
      />
    </>
  );
};

export default DeviceTypeManager;
