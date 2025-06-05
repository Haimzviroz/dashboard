import { Fragment, ReactElement } from 'react';
import { GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '@/types/types';

import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import GA_layout from '@/components/layout/GA-layout';
import { Box } from '@mui/material';
import { Q_PROJECTS } from '@/apis/query-keys';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import ProjectsDashboard from '@/components/projects/projects-page';
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import DashNavBar from '@/components/header/dashboard-nav';
import { CreateProjectDtoProjectTypeEnum } from '@/api/src';

interface ProjectsPageProps {

}

const ProjectsPage: NextPageWithLayout<ProjectsPageProps> = () => {
	return (
		<Fragment>
			<ProjectsDashboard projectType={CreateProjectDtoProjectTypeEnum["Formation"]} />
		</Fragment>
	)
}

export default ProjectsPage


export async function getServerSideProps(context: GetServerSidePropsContext) {
	const httpClient = new SS_ProjectsClient(context)
	const queryClient = new QueryClient();

	try {
		await Promise.allSettled([
			await queryClient.fetchQuery({
				queryKey: [Q_PROJECTS],
				queryFn: () => httpClient.getAllProjects(),
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

ProjectsPage.getLayout = (page: ReactElement) => {
	return (
		<GA_layout page={page} >
			<LTR_MuiProvider>
				<DashNavBar />
				<Box sx={{ padding: 4 }}>
					{/* <NavBar /> */}
					{page}
				</Box>
			</LTR_MuiProvider>
		</GA_layout>
	)
}