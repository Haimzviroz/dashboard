import React, { Fragment, ReactElement, useRef, useState } from 'react';

import GA_layout from '@/components/layout/GA-layout';

import {
	Container,
	Box,
	Stack,
	IconButton,
} from "@mui/material";
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import { Q_DOC, Q_PROJECT } from '@/apis/query-keys';
import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@/types/types';
import { useGetApp } from '@/providers/getapp.provider';
import ProNavBar from '@/components/header/project-nav';
import { useDeleteDoc, useDoc } from '@/hooks/docs.query.hook';
import DocForm from '@/components/projects/docs/doc-form';
import { useProject } from '@/hooks/project.query.hook';
import DocViewer from '@/components/projects/docs/doc-viewer';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import { Delete } from '@mui/icons-material';
import ConfirmDialog from '@/components/utils/dialog/confirm';

interface ProjectFormProps {
}

const ProjectDocs: NextPageWithLayout<ProjectFormProps> = () => {
	const { router } = useGetApp()
	const { project } = useProject(router.query.projectId as string)
	const { doc } = useDoc(router.query.projectId as string, Number(router.query.docId))

	const [isEditing, setIsEditing] = useState(false);

	const formRef = useRef<{ getHandlers: () => { handleSubmit: () => void } }>()

	const [openDialog, setOpenDialog] = useState(false);
	const delDoc = useDeleteDoc()

	const onDelete = () => {
		if (project && doc) {
			delDoc.mutate({ projectName: project.name, docId: doc.id }, {
				onSuccess: () => {
					router.push(router.asPath.replace(/\/[^/]+$/, ''), undefined, { shallow: true });
				}
			})
		}
	}

	const handleDelete = () => {
		setOpenDialog(true)
	}

	return (
		<Container>
			<Stack direction={"row-reverse"} alignItems={"center"} gap={0}>
				<IconButton size="small" onClick={handleDelete} color="error" aria-label="delete">
					<Delete fontSize='small' />
				</IconButton>
				<IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
					{isEditing ? <CancelIcon fontSize='small' /> : <EditIcon fontSize='small' />}
				</IconButton>
				{isEditing &&
					<IconButton size="small" onClick={() => {
						setIsEditing(!isEditing)
						isEditing && formRef.current &&
							formRef.current.getHandlers().handleSubmit()
					}}>
						<SaveIcon fontSize='small' />
					</IconButton>}
			</Stack>
			{project && doc &&
				<Fragment>
					{
						isEditing
							? <DocForm ref={formRef} project={project} doc={doc} />
							: <DocViewer doc={doc} />
					}
				</Fragment>}
			{openDialog && doc && <ConfirmDialog
				open={openDialog}
				setOpen={setOpenDialog}
				mes={`Are you shure te delete '${doc.name}' documentation`}
				onConfirm={onDelete}
			/>}
		</Container>
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
				queryKey: [Q_DOC, docId],
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
			<ProNavBar projectName={page.props.projectName} />
			<Box sx={{ padding: 4 }}>
				{page}
			</Box>
		</LTR_MuiProvider>
	</GA_layout>
}