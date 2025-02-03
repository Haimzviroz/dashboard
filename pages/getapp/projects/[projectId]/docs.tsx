import { Fragment, ReactElement } from 'react';

import GA_layout from '@/components/layout/GA-layout';

import React from "react";
import {
	Box,
	Button,
	Card,
	Stack,
	Typography,
} from "@mui/material";
import { Add } from '@mui/icons-material';
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import { Q_PROJECT } from '@/apis/query-keys';
import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types';
import { useProject } from '@/hooks/project.query.hook';
import { useGetApp } from '@/providers/getapp.provider';
import NavBar from '@/components/header/navigation';
import DocsItem from '@/components/projects/docs/docs-card';

const documentationItems = [
	{ type: 'url', title: 'Getting Started Guide', url: 'https://example.com/start', lastUpdated: '2 days ago' },
	{ type: 'markdown', title: 'API Documentation', content: '# API Documentation\nThis is a sample markdown content.', lastUpdated: '1 week ago' }
];

interface ProjectFormProps {
}

const ProjectDocs: NextPageWithLayout<ProjectFormProps> = () => {
	const { router } = useGetApp()
	const { project } = useProject(router.query.projectId as string)

	return (
		<Fragment>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h6" fontWeight="bold">Documentations</Typography>
				<Button variant="contained" startIcon={<Add />} onClick={() => { }}>Add Docs</Button>
			</Stack>
			<Card sx={{ p: 2, pb: 0 }}>
				{documentationItems.map((doc, index) => (
					<DocsItem doc={doc}></DocsItem>
				))}
			</Card>

		</Fragment>
	);
};

export default ProjectDocs;

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


ProjectDocs.getLayout = (page: ReactElement) => {
	return <GA_layout page={page} >
		<LTR_MuiProvider>
			<NavBar projectName={page.props.projectName} />
			<Box sx={{ padding: 4 }}>
				{page}
			</Box>
		</LTR_MuiProvider>
	</GA_layout>
}