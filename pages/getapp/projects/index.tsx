import { Fragment, ReactElement } from 'react';
import { GetServerSidePropsContext } from 'next';

import NavBar from '@/components/header/navigation';
import ManagementActions from '@/components/projects/management-actions';

import { useGlobal } from '@/hooks';

import { Project as Projects, Auth } from '@/types/interfaces';
import { NextPageWithLayout } from '@/types/types';

import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import GA_layout from '@/components/layout/GA-layout';
import { R_PROJECTS } from '@/apis/routes';
import GlobalProvider from '@/storage/global.storage';
import { Box } from '@mui/material';

interface ManagementProjectsPageProps {
	allProjects: Projects[],
	invitedProjects: Projects[]
}

const ManagementProjectsPage: NextPageWithLayout<ManagementProjectsPageProps> = ({ allProjects, invitedProjects }) => {
	const { updateProject, setActivated } = useGlobal()

	return (
		<Fragment>
			{allProjects.length === 0 && <h1>{`There isn't any projects`}</h1>}
			<ManagementActions setProject={updateProject} setActivated={setActivated} invitedProjects={invitedProjects} />
		</Fragment>
	)
}

export default ManagementProjectsPage




export async function getServerSideProps(context: GetServerSidePropsContext) {

	const httpClient = new SS_ProjectsClient(context)

	try {
		const res: any = await httpClient.getAllProjects()
		const invitedProjects = res?.invitedProjects || []

		if (res?.projects?.length) {
			const defaultProject = res.member.defaultProject || res.projects[0].id
			return {
				redirect: {
					permanent: false,
					destination: R_PROJECTS + `/${defaultProject}/activity`,
					// destination: `/management-projects/${defaultProject}/activity`,
				}
			}
		}
		return {
			props: {
				allProjects: res || [],
				invitedProjects
			}
		}
	} catch (error: any) {
		return httpClient.pagesErrorHandler(error)
	}
}

ManagementProjectsPage.getLayout = (page: ReactElement) => {
	return (
		<GA_layout page={page} >
			<GlobalProvider>
				<Box sx={{ direction: "rtl", padding: 2 }}>
					<NavBar />
					{page}
				</Box>
			</GlobalProvider>
		</GA_layout>
	)
}