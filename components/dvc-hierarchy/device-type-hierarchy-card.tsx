import React, { useEffect, useState } from 'react';
import { Typography, Grid, IconButton, Tooltip, Paper, Box, Stack, Divider } from '@mui/material';
import { Edit, Delete, Devices, Folder, Add } from '@mui/icons-material';
import EntityDialog from './entity-dialog';
import { useDeviceTypeHierarchy, useUpdateDeviceType, useDeleteDeviceType, useAssignProjectToDeviceType, useRemoveProjectFromDeviceType } from '@/hooks/dvc-hierarchy.query.hook';
import { getProjects } from '@/apis/client-side/projects-actions.api';
import AssignProjectDialog from './assign-project-dialog';
import { DeviceTypeDto, ProjectDto, ProjectRefDto } from '@/api/src';
import ProjectDetailsPopover from './project-details-popover';

interface DeviceTypeHierarchyCardProps {
  deviceType: DeviceTypeDto;
  projects: ProjectDto[];
  cardSx?: any;
  headerSx?: any;
  iconColor?: string;
}

const DeviceTypeHierarchyCard: React.FC<DeviceTypeHierarchyCardProps> = ({ deviceType, projects, cardSx, headerSx, iconColor }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: deviceType.name, description: deviceType.description ?? '' });
  const [assignLoading, setAssignLoading] = useState(false);
  const [projectList, setProjectList] = useState<ProjectDto[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data: deviceTypeNode, isLoading } = useDeviceTypeHierarchy(deviceType.id);

  const updateDeviceType = useUpdateDeviceType();
  const deleteDeviceType = useDeleteDeviceType();
  const assignProjectMutation = useAssignProjectToDeviceType();
  const removeProjectMutation = useRemoveProjectFromDeviceType();

  useEffect(() => {
    if (!editDialogOpen) {
      setForm({ name: deviceType.name, description: deviceType.description ?? '' });
    }
  }, [editDialogOpen, deviceType]);

  const handleEdit = () => setEditDialogOpen(true);
  const handleEditSubmit = () => {
    updateDeviceType.mutate({ id: deviceType.id, dto: { name: form.name, description: form.description } });
    setEditDialogOpen(false);
  };
  const handleDelete = () => {
    deleteDeviceType.mutate(deviceType.id);
  };

  // Fetch projects with pagination
  const fetchProjects = async (pageNum = 1) => {
    setAssignLoading(true);
    try {
      // TODO: Replace with paginated API call
      const allProjects = await getProjects();
      setProjectList(allProjects);
      setTotalPages(1); // TODO: set real total pages
    } finally {
      setAssignLoading(false);
    }
  };

  const handleOpenAssignDialog = () => {
    setAssignDialogOpen(true);
    fetchProjects();
  };

  const handleAssignProject = async (project: ProjectDto) => {
    assignProjectMutation.mutate({ deviceTypeId: deviceType.id, projectId: project.id.toString() });
    setAssignDialogOpen(false);
    setSelectedProjectId(null);
  };

  const handleRemoveProject = async (projectId: number) => {
    removeProjectMutation.mutate({ deviceTypeId: deviceType.id, projectId: projectId.toString() });
  };

  if (isLoading) return <Typography variant="body2" color="text.secondary">Loading hierarchy...</Typography>;

  return (
    <Paper elevation={2} sx={{ ...(cardSx || {}), p: 1.5, borderRadius: 2, mb: 1.5, minHeight: 0 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ ...(headerSx || {}), px: 1.5, py: 0.5, mb: 0.5 }}>
        <Box display="flex" alignItems="center">
          <Devices sx={{ mr: 0.5, fontSize: 22, color: iconColor || 'primary.main' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: 16 }}>{deviceType.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{deviceType.description}</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Assign Project">
            <IconButton size="small" onClick={handleOpenAssignDialog}>
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Device Type">
            <IconButton size="small" onClick={handleEdit}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Device Type">
            <IconButton size="small" onClick={handleDelete}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Divider sx={{ my: 1 }} />
      {deviceTypeNode?.projects && deviceTypeNode.projects.length > 0 ? (
        <Grid container spacing={1}>
          {deviceTypeNode.projects.map((proj: ProjectRefDto) => (
            <Grid item key={proj.projectId} xs={12} sm={6} md={4} minWidth={200}>
              <ProjectDetailsPopover projectId={proj.projectId}>
                <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, height: '100%' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                      <Folder sx={{ mt: 0.25, mr: 0.5, fontSize: 18, color: 'secondary.main' }} />
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: 13 }}>
                        {proj.projectName}
                      </Typography>
                    </Box>
                    <Tooltip title="Remove Project">
                      <IconButton size="small" onClick={() => handleRemoveProject(proj.projectId)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </ProjectDetailsPopover>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" fontStyle="italic" color="text.secondary" sx={{ fontSize: 13 }}>
          No projects assigned.
        </Typography>
      )}
      <EntityDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        entityForm={form}
        setEntityForm={setForm}
        mode="edit"
        entityType="deviceType"
      />
      <AssignProjectDialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        onAssign={handleAssignProject}
        projects={projectList}
        loading={assignLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />
    </Paper>
  );
};

export default DeviceTypeHierarchyCard;
