import React, { use, useEffect, useState } from 'react';
import { Typography, Grid, IconButton, Tooltip, Paper, Box, Stack, Divider } from '@mui/material';
import { Add, Edit, Delete, Business, Devices } from '@mui/icons-material';
import AssignDeviceDialog from './assign-device-dialog';
import EntityDialog from './entity-dialog';
import { DeviceTypeDto, DeviceTypeHierarchyDto, PlatformDto } from '@/api/src';
import { useAssignDeviceTypeToPlatform, useDeletePlatform, usePlatformHierarchy, useRemoveDeviceTypeFromPlatform, useUpdatePlatform } from '@/hooks/dvc-hierarchy.query.hook';

interface PlatformHierarchyCardProps {
  platform: PlatformDto;
  deviceTypes: DeviceTypeDto[];
}

const PlatformHierarchyCard: React.FC<PlatformHierarchyCardProps> = ({ platform, deviceTypes }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<number[]>([]);
  const [form, setForm] = useState({ name: platform.name, description: platform.description ?? '' });

  const { data: platformNode, isLoading } = usePlatformHierarchy(platform.id);
  const updatePlatform = useUpdatePlatform();
  const deletePlatform = useDeletePlatform();
  const assignMutation = useAssignDeviceTypeToPlatform(platform.id);
  const removeMutation = useRemoveDeviceTypeFromPlatform(platform.id);

  useEffect(() => {
    if (!editDialogOpen) {
      setForm({ name: platform.name, description: platform.description ?? '' });
    }
  }, [editDialogOpen, platform]);

  useEffect(() => {
    if (!assignDialogOpen) {
      setSelectedDeviceTypes([]);
    }
  }, [assignDialogOpen]);

  // Edit platform
  const handleEdit = () => setEditDialogOpen(true);
  const handleEditSubmit = () => {
    updatePlatform.mutate({ id: platform.id, dto: { name: form.name, description: form.description } });
    setEditDialogOpen(false);
  };
  const handleDelete = () => {
    deletePlatform.mutate(platform.id);
  };

  // Assign device type
  const handleAssign = () => setAssignDialogOpen(true);
  const handleAssignDeviceType = async () => {
    if (!selectedDeviceTypes.length) return;
    for (const id of selectedDeviceTypes) {
      assignMutation.mutate({ platformId: platform.id, deviceTypeIds: id });
    }
    setAssignDialogOpen(false);
    setSelectedDeviceTypes([]);
  }

  // Remove device type
  const handleRemoveDeviceType = async (deviceTypeId: number) => {
    removeMutation.mutate({ platformId: platform.id, deviceTypeId });
  };

  if (isLoading) return <Typography variant="body2" color="text.secondary">Loading hierarchy...</Typography>;

  return (
    <Paper elevation={3} sx={{
      p: 0,
      borderRadius: 3,
      mb: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)',
      boxShadow: '0 4px 24px 0 rgba(60,72,100,0.08)',
    }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 2,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          background: 'rgba(255,255,255,0.85)',
          borderBottom: '1px solid #e0e3e7',
        }}
      >
        <Box display="flex" alignItems="center">
          <Business sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 0.5 }}>{platform.name}</Typography>
            <Typography variant="body2" color="text.secondary">{platform.description}</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={0} alignItems="center">
          <Tooltip title="Assign Device Type">
            <IconButton size="small" onClick={handleAssign} sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}>
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Platform">
            <IconButton size="small" onClick={handleEdit} sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Platform">
            <IconButton size="small" onClick={handleDelete} sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {platformNode?.deviceTypes && platformNode.deviceTypes.length > 0 ? (
          <Grid container spacing={2}>
            {platformNode.deviceTypes.map((dt: DeviceTypeHierarchyDto) => {
              if (!dt) return null;
              return (
                <Grid item key={dt.deviceTypeId} xs={12} sm={6} md={4} minWidth={200}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" alignItems="flex-start">
                        <Devices sx={{ mt: 0.5, mr: 1, color: 'secondary.main' }} />
                        <Typography variant="body2" fontWeight={500}>{dt.deviceTypeName}</Typography>
                      </Box>
                      <Tooltip title="Remove Device Type">
                        <IconButton size="small" onClick={() => handleRemoveDeviceType(dt.deviceTypeId)} disabled={removeMutation.isPending} sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body2" fontStyle="italic" color="text.secondary">
            No device types assigned.
          </Typography>
        )}
      </Box>
      <EntityDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        entityForm={form}
        setEntityForm={setForm}
        mode="edit"
        entityType="platform"
      />
      <AssignDeviceDialog
        open={assignDialogOpen}
        deviceTypes={deviceTypes.filter(dt =>
          !((platformNode?.deviceTypes || []).map(dtObj => dtObj.deviceTypeId).includes(dt.id))
        )}
        selectedDeviceTypes={selectedDeviceTypes}
        setSelectedDeviceTypes={setSelectedDeviceTypes}
        onClose={() => setAssignDialogOpen(false)}
        onAssign={handleAssignDeviceType}
      />
    </Paper>
  );
};

export default PlatformHierarchyCard;
