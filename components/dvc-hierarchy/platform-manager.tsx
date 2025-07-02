import React, { useState } from 'react';
import { Typography, Button, Grid, Box, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import EntityDialog from './entity-dialog';
import { useCreatePlatform } from '@/hooks/dvc-hierarchy.query.hook';
import { DeviceTypeDto, PlatformDto } from '@/api/src';
import PlatformHierarchyCard from './platform-hierarchy-card';

interface PlatformManagerProps {
  platforms: PlatformDto[];
  deviceTypes: DeviceTypeDto[];
}

const PlatformManager: React.FC<PlatformManagerProps> = ({ platforms, deviceTypes }) => {
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; data: PlatformDto | null }>({ open: false, mode: 'create', data: null });
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  const createPlatform = useCreatePlatform();

  const openDialog = (mode: 'create' | 'edit', platform?: PlatformDto) => {
    setDialog({ open: true, mode, data: platform || null });
    setForm(platform ? { name: platform.name, description: platform.description ?? '' } : { name: '', description: '' });
  };

  const handleClose = () => {
    setDialog({ open: false, mode: 'create', data: null });
    setForm({ name: '', description: '' });
    setError(null);
  };

  const handleSubmit = async () => {
    createPlatform.mutate({ name: form.name, description: form.description }, {
      onError: (error) => {
        setError(error?.message || 'Operation failed');
      },
    });
    handleClose();
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Platform & Device Type Manager</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog('create')}>
          Add Platform
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      <Grid container spacing={4}>
        {platforms.map((platform) => (
          <Grid item xs={12} key={platform.id}>
            <PlatformHierarchyCard
              platform={platform}
              deviceTypes={deviceTypes}
            />
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
        entityType="platform"
      />
    </>
  );
};

export default PlatformManager;
