import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Select, MenuItem, CircularProgress, Pagination } from '@mui/material';
import { ProjectDto } from '@/api/src';

interface AssignProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (project: ProjectDto) => void;
  projects: ProjectDto[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

const AssignProjectDialog: React.FC<AssignProjectDialogProps> = ({
  open, onClose, onAssign, projects, loading, page, totalPages, onPageChange, selectedProjectId, setSelectedProjectId
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Project to Device Type</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body2" mb={1}>Select a project to assign:</Typography>
            <Select
              fullWidth
              value={selectedProjectId || ''}
              onChange={e => setSelectedProjectId(e.target.value as string)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select project...</MenuItem>
              {projects.map(proj => (
                <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
              ))}
            </Select>
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => onPageChange(p)}
                color="primary"
                size="small"
              />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            const proj = projects.find(p => String(p.id) == selectedProjectId!);
            console.log({proj, selectedProjectId, projects});
            
            if (proj) onAssign(proj);
          }}
          variant="contained"
          disabled={!selectedProjectId}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignProjectDialog;
