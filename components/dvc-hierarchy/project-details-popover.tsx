import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, CircularProgress, Popover } from '@mui/material';
import { useProject } from '@/hooks/project.query.hook';

interface ProjectDetailsPopoverProps {
  projectId: string | number;
  children: React.ReactNode;
  delay?: number;
}

const ProjectDetailsPopover: React.FC<ProjectDetailsPopoverProps> = ({
  projectId,
  children,
  delay = 300,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [fetchEnabled, setFetchEnabled] = useState(false);

  const enterTimer = useRef<NodeJS.Timeout | null>(null);
  const leaveTimer = useRef<NodeJS.Timeout | null>(null);

  const { project, isLoading } = useProject(projectId.toString(), {
    enabled: fetchEnabled
  });

  const handleEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    enterTimer.current = setTimeout(() => {
      setAnchorEl(wrapperRef.current);
      setFetchEnabled(true);
      setOpen(true);
    }, delay);
  };

  const handleLeave = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    leaveTimer.current = setTimeout(() => {
      setOpen(false);
    }, delay / 2);
  };

  useEffect(() => {
    return () => {
      if (enterTimer.current) clearTimeout(enterTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  return (
    <>
      <Box
        ref={wrapperRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        sx={{ display: 'inline-block', width: '100%' }}
      >
        {children}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleLeave}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
        slotProps={{ paper: { sx: { pointerEvents: 'none', maxWidth: 340, p: 0, borderRadius: 2, boxShadow: 3 } } }}
      >
        <Box p={2} minWidth={260}>
          <Typography variant="caption" color="primary" fontWeight={700} sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>
            Project Details
          </Typography>
          {isLoading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} />
              <Typography variant="body2">Loading...</Typography>
            </Box>
          ) : project ? (
            <>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>{project.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{project.description}</Typography>
              {project.summary?.latestRelease && (
                <Box mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Latest Version:{' '}
                    {project.summary.latestRelease.name && <b>{project.summary.latestRelease.name}</b>}
                    {project.summary.latestRelease.version && <> ({project.summary.latestRelease.version})</>}
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">No details available.</Typography>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default ProjectDetailsPopover;
