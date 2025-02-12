import { ProjectDto, DetailedReleaseDto, SetReleaseDto } from "@/api/src";
import RelShortInfo from './releases-info-short';
import { FC, Fragment, use, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import RelInfoSec from './releases-info-sec';
import RelInfoDepend from './releases-info-depend';
import { useSetRelease } from "@/hooks/releases.query.hook";

interface ReleasesInfoProps {
  release: DetailedReleaseDto;
  project: ProjectDto;
}

const ReleasesInfo: FC<ReleasesInfoProps> = ({ release, project }) => {
  const setRelDto = (): SetReleaseDto => ({
    version: release.version,
    name: release.name,
    isDraft: release.status === "draft",
    dependencies: release.dependencies?.map(d => d.id),
    metadata: release.metadata,
    releaseNotes: release.releaseNotes
  })

  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const [rel, setRel] = useState<SetReleaseDto>(setRelDto())
  const setRelease = useSetRelease()

  useEffect(() => {
    if (!firstLoad) {
      setRelease.mutate({ projectName: project.name, data: rel })
    }
    setFirstLoad(false)
  }, [rel])


  return (
    <Fragment>
      <Box mb={2}>
        <RelShortInfo type="page" release={release} project={project} />
      </Box>
      <RelInfoSec sectionName={'Release Notes'} info={"Release Note info"} />
      <RelInfoSec sectionName={'Dependencies'} info={<RelInfoDepend project={project} rel={release} setRel={setRel} />} />
      <RelInfoSec sectionName={'Meta data'} info={"Meta data info"} />
      <RelInfoSec sectionName={'Regulations'} info={"Regulations info"} />
      <RelInfoSec sectionName={'Artifacts'} info={"Artifacts info"} />
    </Fragment>
  );
};

export default ReleasesInfo;
