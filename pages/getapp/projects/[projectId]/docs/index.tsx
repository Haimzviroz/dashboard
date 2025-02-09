import React, { Fragment, ReactElement } from 'react';

import GA_layout from '@/components/layout/GA-layout';

import {
	Box,
	Button,
	Card,
	Stack,
	Typography,
} from "@mui/material";
import { Add } from '@mui/icons-material';
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import { Q_DOCS, Q_PROJECT } from '@/apis/query-keys';
import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types';
import { useGetApp } from '@/providers/getapp.provider';
import ProNavBar from '@/components/header/project-nav';
import DocsItem from '@/components/projects/docs/doc-card';
import { useDocs } from '@/hooks/docs.query.hook';
import { useProject } from '@/hooks/project.query.hook';

interface ProjectFormProps {
}

const ProjectDocs: NextPageWithLayout<ProjectFormProps> = () => {
	const { router } = useGetApp()
	const { project } = useProject(router.query.projectId as string)
	const { docs } = useDocs(router.query.projectId as string)

	return (
		<Fragment>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h6" fontWeight="bold">Documentations</Typography>
				<Button variant="contained" startIcon={<Add />} onClick={() => router.push(router.asPath + "/new")}>Add Docs</Button>
			</Stack>
			{project && !!docs?.length && <Card sx={{ p: 2, pb: 0 }}>
				{docs?.map((doc) => (
					<DocsItem key={doc.id} project={project} doc={doc}></DocsItem>
				))}
			</Card>}
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
			await queryClient.fetchQuery({
				queryKey: [Q_DOCS, projectName],
				queryFn: () => httpClient.getProjectDocs(projectName as string),
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
			<ProNavBar projectName={page.props.projectName} />
			<Box sx={{ padding: 4 }}>
				{page}
			</Box>
		</LTR_MuiProvider>
	</GA_layout>
}