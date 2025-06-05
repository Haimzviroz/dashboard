import { Fragment, ReactElement } from 'react';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types';


import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import GA_layout from '@/components/layout/GA-layout';
import { Box, Container, Divider, Typography } from '@mui/material';
import ProNavBar from '@/components/header/project-nav';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Q_PROJECT, Q_TOKENS } from '@/apis/query-keys';
import { useProject } from '@/hooks/project.query.hook';
import { useGetApp } from '@/providers/getapp.provider';
import ProjectMembers from '@/components/projects/members/project-members';
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import ProjectTokens from '@/components/projects/tokens/token-list';
import { useTokens } from '@/hooks/token.query.hook';

interface ManagementProjectsPageProps {
}

const ProjectOverview: NextPageWithLayout<ManagementProjectsPageProps> = () => {
  const { router } = useGetApp()
  const { project } = useProject(router.query.projectId as string)
  const { tokens } = useTokens(router.query.projectId as string)

  return (
    <Container>
      {/* <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mt: 1, mb: 2 }}
      >
        {project?.description}
      </Typography> */}
      <Divider />
      {project && <ProjectMembers project={project} />}
      {tokens && project && <ProjectTokens project={project} tokens={tokens}></ProjectTokens>}
    </Container>

  );
}

export default ProjectOverview


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const projectName = ctx.params?.projectId
  const queryClient = new QueryClient();

  const httpClient = new SS_ProjectsClient(ctx)

  try {
    await Promise.allSettled([
      await queryClient.fetchQuery({
        queryKey: [Q_PROJECT, projectName],
        queryFn: () => httpClient.getProjectByName(projectName as string),
      }),
      await queryClient.fetchQuery({
        queryKey: [Q_TOKENS, projectName],
        queryFn: () => httpClient.getProjectTokens(projectName as string),
      }),
    ])

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        projectName
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

ProjectOverview.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <LTR_MuiProvider>
      <ProNavBar projectName={page.props.projectName} />
      <Box sx={{ padding: 4 }}>
        {page}
      </Box>
    </LTR_MuiProvider>
  </GA_layout>
}