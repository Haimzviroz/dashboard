import { ProjectDto, DetailedReleaseDto, SetReleaseDto } from "@/api/src";
import RelShortInfo from './releases-info-short';
import { FC, Fragment, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import RelInfoSec from './releases-info-sec';
import RelInfoDepend from './releases-info-depend';
import { useSetRelease } from "@/hooks/releases.query.hook";

import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import GavelIcon from '@mui/icons-material/Gavel';
import InventoryIcon from '@mui/icons-material/Inventory';
import HubIcon from '@mui/icons-material/Hub';
import RelInfoArts from "./releases-info-arts";
import RelInfoRegs from "./releases-info-regs";

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
      <RelInfoSec sectionName={'Release Notes'} icon={DescriptionIcon} info={"Release Note info"} />
      <RelInfoSec sectionName={'Meta data'} icon={InfoIcon} info={"Meta data info"} />
      <RelInfoSec sectionName={'Regulations'} icon={GavelIcon} info={<RelInfoRegs project={project} rel={release} setRel={setRel} />} />
      <RelInfoSec sectionName={'Artifacts'} icon={InventoryIcon} info={<RelInfoArts project={project} rel={release} setRel={setRel} />} />
      <RelInfoSec sectionName={'Dependencies'} icon={HubIcon} info={<RelInfoDepend project={project} rel={release} setRel={setRel} />} />
    </Fragment>
  );
};

export default ReleasesInfo;
