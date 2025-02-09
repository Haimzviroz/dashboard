import { ReactElement } from 'react';

import GA_layout from '@/components/layout/GA-layout';
import GlobalProvider from '@/storage/global.storage';

import React from "react";
import {
	Box,
} from "@mui/material";
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import { Q_PROJECT } from '@/apis/query-keys';
import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types';
import ProjectForm from '@/components/projects/projects/project-form';
import { useProject } from '@/hooks/project.query.hook';
import { useGetApp } from '@/providers/getapp.provider';
import ProNavBar from '@/components/header/project-nav';

interface ProjectFormProps {
}

const ProjectSettings: NextPageWithLayout<ProjectFormProps> = () => {
	const { router } = useGetApp()
	const { project } = useProject(router.query.projectId as string)

	return (
		<ProjectForm project={project} />
	);
};

export default ProjectSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const projectName = ctx.params?.projectId
	const queryClient = new QueryClient();

	const httpClient = new SS_ProjectsClient(ctx)

	try {
		await Promise.allSettled([
			await queryClient.prefetchQuery({
				queryKey: [Q_PROJECT, projectName],
				queryFn: () => httpClient.getProjectByName(projectName as string),
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


ProjectSettings.getLayout = (page: ReactElement) => {
	return <GA_layout page={page} >
		<LTR_MuiProvider>
			<ProNavBar projectName={page.props.projectName} />
			<Box sx={{ padding: 4 }}>
				{page}
			</Box>
		</LTR_MuiProvider>
	</GA_layout>
}