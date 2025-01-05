import { Fragment, ReactElement } from 'react';
import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import Project from '@/components/management-projects/project';
import ManagementActions from '@/components/management-projects/management-actions';
import NavBar from '@/components/header/navigation';

import { Auth, Project as Projects } from '@/types/interfaces';
import { NextPageWithLayout } from '@/types/types';
import { NavBarOption } from '@/types/enum';

import { useGetApp, useGlobal } from '@/hooks';

import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import GA_layout from '@/components/layout/GA-layout';
import GlobalProvider from '@/storage/global.storage';
import { Box } from '@mui/material';

interface ManagementProjectsPageProps {
  allProjects: Projects[],
  currentProject: Projects
}

const ManagementProjectsPage: NextPageWithLayout<ManagementProjectsPageProps> = ({ allProjects, currentProject }) => {

  const { router } = useGetApp()
  const { setProjects, setSelectedProject, updateProject, setActivated } = useGlobal()

  useEffect(() => {
    console.log("effect");

    setProjects(allProjects)
    setSelectedProject(Object.keys(currentProject).length ? currentProject : allProjects[0])
    setActivated(router.pathname.split('/')[router.pathname.split('/').length - 1] as NavBarOption)
  }, [])

  const getAllProjects = () => {
    if (!allProjects?.length) {
      return <h1>{`There isn't any projects`}</h1>
    }
    else {
      return (
        <Fragment>
          {currentProject && <Project
            project={currentProject}
            setProject={updateProject}
          ></Project>}
        </Fragment>
      )
    }
  }

  return (
    <Fragment>
      {getAllProjects()}
      <ManagementActions setProject={updateProject} setActivated={setActivated} />
    </Fragment>
  )
}

export default ManagementProjectsPage


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const params = ctx.params?.projectId
  const httpClient = new SS_ProjectsClient(ctx)

  try {
    const res: any = await httpClient.getAllProjects()

    const allProjects = res?.projects || []
    const currentProject = res?.projects?.find((p: Projects) => p.id.toString() === params)
    if (!allProjects.length || !currentProject) {
      return { notFound: true };
    }
    return {
      props: {
        allProjects,
        currentProject
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

ManagementProjectsPage.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <GlobalProvider>
      <Box sx={{ direction: "rtl", padding: 2 }}>
        <NavBar />
        {page}
      </Box>
    </GlobalProvider>
  </GA_layout>
}