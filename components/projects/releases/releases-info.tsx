import { NextPageWithLayout } from '@/types/types';

import { ProjectDto, DetailedReleaseDto } from "@/api/src";
import RelShortInfo from './releases-info-short';
import { Fragment } from 'react';

interface ReleasesInfoProps {
  release: DetailedReleaseDto
  project: ProjectDto
}

const ReleasesInfo: NextPageWithLayout<ReleasesInfoProps> = ({ release, project }) => {

  return (
    <Fragment>
      <RelShortInfo type="page" release={release} project={project} />
    </Fragment>
  )
}

export default ReleasesInfo