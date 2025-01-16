import { Fragment, ReactElement } from 'react';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types';


import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import GA_layout from '@/components/layout/GA-layout';
import { Box } from '@mui/material';
import NavBar from '@/components/header/navigation';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Q_PROJECT } from '@/apis/query-keys';
import { useProject } from '@/hooks/project.query.hook';
import { useGetApp } from '@/providers/getapp.provider';
import ProjectMembers from '@/components/projects/project-members';
import LTR_MuiProvider from '@/providers/ltr-mui.provider';

interface ManagementProjectsPageProps {
}

const ProjectOverview: NextPageWithLayout<ManagementProjectsPageProps> = () => {
  const { router } = useGetApp()
  const { project } = useProject(router.query.projectId as string)

  return (
    <Fragment>
      <ProjectMembers project={project} />
    </Fragment>

  );
}

export default ProjectOverview


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const params = ctx.params?.projectId
  const queryClient = new QueryClient();

  const httpClient = new SS_ProjectsClient(ctx)

  try {
    await Promise.allSettled([
      await queryClient.prefetchQuery({
        queryKey: [Q_PROJECT, params],
        queryFn: () => httpClient.getProjectByName(params as string),
      }),
    ])

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

ProjectOverview.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <LTR_MuiProvider>
      <Box sx={{ padding: 2 }}>
        <NavBar />
        {page}
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}