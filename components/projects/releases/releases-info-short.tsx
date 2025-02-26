import { NextPageWithLayout } from '@/types/types';

import { Box, Chip, IconButton, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import { OpenInNew, Delete } from "@mui/icons-material";
import Distribute from "../../../assets/projects/distribute.svg"
import DistributeDisabled from "../../../assets/projects/distribute-disabled.svg"
import { DetailedReleaseDto, ProjectDto, ReleaseDto, ReleaseDtoStatusEnum } from "@/api/src";
import { useGetApp } from '@/providers/getapp.provider';
import { R_APP_DEVICES } from '@/apis/routes';
import { useDeleteRelease } from '@/hooks/releases.query.hook';
import { Fragment, useState } from 'react';
import ConfirmDialog from '@/components/utils/dialog/confirm';

interface RelShortInfoProps {
  type: "page" | "item"
  release: ReleaseDto | DetailedReleaseDto
  project: ProjectDto
}

const RelShortInfo: NextPageWithLayout<RelShortInfoProps> = ({ type, release, project }) => {

  const { router } = useGetApp()
  const deleteRelease = useDeleteRelease()
  const [openDelDialog, setOpenDelDialog] = useState(false);


  const materialStatusColors: Record<ReleaseDtoStatusEnum, string> = {
    [ReleaseDtoStatusEnum.Draft]: '#E0E0E0', // Light gray
    [ReleaseDtoStatusEnum.InReview]: '#2196F3', // Blue
    [ReleaseDtoStatusEnum.Approved]: '#4CAF50', // Green
    [ReleaseDtoStatusEnum.Released]: '#D1C4E9', // Purple
    [ReleaseDtoStatusEnum.Archived]: '#F44336', // Red
  };

  const getChipColor = (status: ReleaseDtoStatusEnum): string => materialStatusColors[status] || '#9E9E9E';

  const handleDelete = () => {
    setOpenDelDialog(true)
  }

  const onDelete = () => {
    deleteRelease.mutate({ projectName: project.name, version: release.version })
  }

  return (
    <Fragment>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"column"} alignItems={"flex-start"} flexWrap={"wrap"} gap={1}>
          {release.name && <Typography variant="h5" fontWeight={'bold'} >
            {release.name}
          </Typography>}
          <Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} flexWrap={"wrap"} gap={1}>
            <Typography variant={!!release.name ? "h6" : "h5"} fontWeight={!!release.name ? "" : "bold"} >
              Version {release.version}
            </Typography>
            <Chip
              label={release.status}
              sx={{ backgroundColor: getChipColor(release.status), height: 20, width: 80 }}
              size="small"
            />
          </Stack>
          <Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} flexWrap={"wrap"} gap={2}>
            <Typography variant="body2" color="text.secondary">
              <b>Created On:</b> {release.createdAt ? new Date(release.createdAt).toLocaleDateString() : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Updated On: </b> {release.updatedAt ? new Date(release.updatedAt).toLocaleDateString() : "N/A"}
            </Typography>
            {release.releasedAt && (
              <Typography variant="body2" color="text.secondary">
                Released On: {new Date(release.releasedAt).toLocaleDateString()}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Box>
          <Tooltip title="Distribute version" arrow>
            <IconButton
              onClick={() => router.push(R_APP_DEVICES + "?software=" + release.id)}
              disabled={release.status !== 'released'}
              size='small'
            >
              {release.status !== 'released' ? <DistributeDisabled /> : <Distribute />}
            </IconButton>
          </Tooltip>
          {type === "item" &&
            <IconButton
              aria-label="Edit version"
              size='small'
              onClick={() => router.push(`${router.asPath}/${release.version}`)}>
              <OpenInNew />
            </IconButton>}
          <IconButton color="error" aria-label="Delete version"
            size='small'
            onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Box>
      </Stack>

      {!!release.requiredRegulationsCount && <Box sx={{ marginTop: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Compliance Progress
        </Typography>
        <LinearProgress
          sx={{
            height: 5, borderRadius: 5, maxWidth: 400,
            backgroundColor: "#e0e0e0", // Neutral light gray background
            '& .MuiLinearProgress-bar': {
              backgroundColor: "#4caf50", // Conventionally green for success
            },
          }}
          variant="determinate"
          value={
            release.requiredRegulationsCount > 0
              ? (release.compliantRegulationsCount / release.requiredRegulationsCount) * 100
              : 100
          }
        />
        <Typography variant="caption" color="text.secondary" sx={{ marginTop: 1 }}>
          {release.compliantRegulationsCount}/{release.requiredRegulationsCount} regulations compliant
        </Typography>
      </Box>}
      {openDelDialog && <ConfirmDialog
        open={openDelDialog}
        setOpen={setOpenDelDialog}
        mes={`Are you sure you want to delete ${release.name ? "'" + release.name + "'" : ""} version '${release.version}'?`}
        onConfirm={onDelete}
      />}
    </Fragment>
  )
}

export default RelShortInfo