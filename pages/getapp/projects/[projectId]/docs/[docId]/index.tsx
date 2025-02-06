import React, { Fragment, ReactElement, useRef, useState } from 'react';

import GA_layout from '@/components/layout/GA-layout';

import {
	Box,
	Stack,
} from "@mui/material";
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import { Q_DOCS, Q_PROJECT } from '@/apis/query-keys';
import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types';
import { useGetApp } from '@/providers/getapp.provider';
import NavBar from '@/components/header/navigation';
import { useDoc } from '@/hooks/docs.query.hook';
import DocForm from '@/components/projects/docs/doc-form';
import { useProject } from '@/hooks/project.query.hook';
import DocViewer from '@/components/projects/docs/doc-viewer';
import O_IconButton from '@/ui/o-icon-button';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/CancelOutlined';

interface ProjectFormProps {
}

const ProjectDocs: NextPageWithLayout<ProjectFormProps> = () => {
	const { router } = useGetApp()
	const { project } = useProject(router.query.projectId as string)
	const { doc } = useDoc(router.query.projectId as string, Number(router.query.docId))

	const [isEditing, setIsEditing] = useState(false);

	const formRef = useRef<{ getHandlers: () => { handleSubmit: () => void } }>()


	return (
		<Fragment>
			<Stack direction={"row-reverse"} alignItems={"center"} gap={1}>
				<O_IconButton onClick={() => setIsEditing(!isEditing)}>
					{isEditing ? <CancelIcon /> : <EditIcon />}
				</O_IconButton>
				{isEditing &&
					<O_IconButton onClick={() => {
						setIsEditing(!isEditing)
						isEditing && formRef.current &&
							formRef.current.getHandlers().handleSubmit()
					}}>
						<SaveIcon />
					</O_IconButton>}
			</Stack>
			{project && doc &&
				<Fragment>
					{
						isEditing
							? <DocForm ref={formRef} project={project} doc={doc} />
							: <DocViewer doc={doc} />
					}
				</Fragment>}
		</Fragment>
	);
};

export default ProjectDocs;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const projectName = ctx.params?.projectId
	const docId = Number(ctx.params?.docId as string)
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
				queryFn: () => httpClient.getProjectDoc(projectName as string, docId),
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