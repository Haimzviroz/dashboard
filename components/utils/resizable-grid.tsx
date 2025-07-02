import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';

interface ResizableGridProps {
  left: React.ReactNode;
  right: React.ReactNode;
  minLeft?: number;
  minRight?: number;
}

const ResizableGrid: React.FC<ResizableGridProps> = ({ left, right, minLeft = 250, minRight = 250 }) => {
  const [leftWidth, setLeftWidth] = useState(60); // percent
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;
    if (percent < (minLeft / rect.width) * 100) percent = (minLeft / rect.width) * 100;
    if (percent > 100 - (minRight / rect.width) * 100) percent = 100 - (minRight / rect.width) * 100;
    setLeftWidth(percent);
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = '';
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <Box ref={containerRef} display="flex" width="100%" height="100%" position="relative">
      <Box flexBasis={`${leftWidth}%`} flexGrow={0} flexShrink={0} minWidth={minLeft} maxWidth={`calc(100% - ${minRight}px)`}>
        {left}
      </Box>
      <Box
        sx={{
          width: 8,
          cursor: 'col-resize',
          background: 'rgba(0,0,0,0.07)',
          zIndex: 2,
          transition: 'background 0.2s',
          '&:hover': { background: 'rgba(0,0,0,0.15)' },
        }}
        onMouseDown={handleMouseDown}
      />
      <Box flexGrow={1} minWidth={minRight}>
        {right}
      </Box>
    </Box>
  );
};

export default ResizableGrid;
