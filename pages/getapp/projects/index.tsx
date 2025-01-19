import { Fragment, ReactElement } from 'react';
import { GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '@/types/types';

import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import GA_layout from '@/components/layout/GA-layout';
import GlobalProvider from '@/storage/global.storage';
import { Box } from '@mui/material';
import { Q_PROJECTS } from '@/apis/query-keys';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import ProjectsDashboard from '@/components/projects/management-actions';

interface ProjectsPageProps {

}

const ProjectsPage: NextPageWithLayout<ProjectsPageProps> = () => {
	return (
		<Fragment>
			<ProjectsDashboard/>
		</Fragment>
	)
}

export default ProjectsPage




export async function getServerSideProps(context: GetServerSidePropsContext) {
	const httpClient = new SS_ProjectsClient(context)
	const queryClient = new QueryClient();

	try {
		await Promise.allSettled([
			await queryClient.prefetchQuery({
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
			<GlobalProvider>
				<Box sx={{ direction: "rtl", padding: 2 }}>
					{/* <NavBar /> */}
					{page}
				</Box>
			</GlobalProvider>
		</GA_layout>
	)
}