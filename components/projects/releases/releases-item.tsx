import { NextPageWithLayout } from '@/types/types';

import { Card, CardContent } from "@mui/material";
import { ProjectDto, ReleaseDto } from "@/api/src";
import RelShortInfo from './releases-info-short';

interface ReleasesItemProps {
  release: ReleaseDto
  project: ProjectDto
}

const ReleasesItem: NextPageWithLayout<ReleasesItemProps> = ({ release, project }) => {

  return (
    <Card
      className="release-card"
      key={release.id}
      variant="outlined"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 0,
        borderTop: 0
      }}
    >
      <CardContent sx={{ width: "100%" }} >
        <RelShortInfo type="item" release={release} project={project} />
      </CardContent>
    </Card>
  )
}

export default ReleasesItem