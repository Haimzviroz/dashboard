import { Fragment, ReactElement, useEffect, useMemo, useState } from "react"
import { GetServerSidePropsContext } from "next/types";
import { useRouter } from 'next/router';

import PlatformRelease from "@/components/project-releases/platform-release";
import ProjectName from "@/components/header/project-name";
import NavBar from "@/components/header/navigation";

import { Project, Formations, Platform, Platforms, Release } from "@/types/interfaces";
import { NextPageWithLayout } from '@/types/types';
import { NavBarOption } from "@/types/enum";

import { useGlobal } from "@/hooks";
import { SS_ProjectsClient } from "@/apis/server-side/ss_projects-client";
import GA_layout from "@/components/layout/GA-layout";
import GlobalProvider from "@/storage/global.storage";
import { Box } from "@mui/material";

interface ProductReleasesProps {
  releases: Release[];
  allProjects: Project[];
  currentProject: Project;
}

const ProjectReleases: NextPageWithLayout<ProductReleasesProps> = ({ releases, allProjects, currentProject }) => {
  const router = useRouter();

  const { selectedProject, setProjects, setSelectedProject, setActivated } = useGlobal()

  useEffect(() => {
    setProjects(allProjects)
    setActivated(router.pathname.split('/')[router.pathname.split('/').length - 1] as NavBarOption)
    setSelectedProject(currentProject)
  }, [])

  const processingReleases = useMemo(() => {
    const platforms: Platforms = {} as Platforms
    releases.forEach((rel: Release) => {
      const platform = rel.platform
      if (!platforms[platform]) {
        platforms[platform] = { name: rel.platform, formations: {} }
      }
      const formation = rel.formation
      if (!platforms[platform].formations[formation]) {
        platforms[platform].formations[formation] = []
      }
      platforms[platform].formations[formation].push(rel)
    })
    for (const key in platforms) {
      for (const k in platforms[key].formations) {
        platforms[key].formations[k].sort((a, b) => b.version.localeCompare(a.version))
      }
    }
    return platforms
  }, [releases])

  const [platforms, setPlatform] = useState<Platforms>(processingReleases)

  useEffect(() => {
    setPlatform(processingReleases)
  }, [processingReleases])

  const getPlatforms = () => {
    const platformTable: ReactElement[] = []
    for (const key in platforms) {
      platformTable.push(<PlatformRelease key={Math.random()} platform={platforms[key]} />)
    }
    return platformTable
  }

  return (
    <Fragment>
      {selectedProject && <ProjectName project={selectedProject}></ProjectName>}
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>version</th>
            <th>upload</th>
            <th>security</th>
            <th>policy</th>
            <th>deployment</th>
          </tr>
        </thead>
        {getPlatforms()}
      </table>
    </Fragment>
  )
}

export default ProjectReleases



export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx.params
  const httpClient = new SS_ProjectsClient(ctx)

  try {
    const allProjects: [] = (await httpClient.getAllProjects()).projects || [];
    const releases = await httpClient.getProjectReleases(params?.projectId as string);
    const currentProject = allProjects.find((p: Project) => p.id.toString() === params?.projectId);

    if (!allProjects.length || !currentProject) {
      return { notFound: true };
    }
    return {
      props: {
        releases: releases || [],
        allProjects,
        currentProject
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

ProjectReleases.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <GlobalProvider>
      <Box sx={{ direction: "rtl", padding: 2 }}>
        <NavBar />
        {page}
      </Box>
    </GlobalProvider>
  </GA_layout>
}