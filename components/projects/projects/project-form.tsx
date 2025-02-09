import { FC, Fragment } from 'react';


import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	CircularProgress,
	Divider,
	Alert,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@mui/material";
import { createProject, deleteProject, SearchProjects } from '@/apis/client-side/projects-actions.api';
import { R_PROJECTS } from '@/apis/routes';
import { ProNavBarOption } from '@/types/enum';
import { useRouter } from 'next/router';
import { CreateProjectDtoProjectTypeEnum, DetailedProjectDto } from '@/api/src';
import { useUpdateProject } from '@/hooks/project.query.hook';
import { AxiosError } from 'axios';

interface DeleteDialogProps {
	openDialog: boolean;
	handleCloseDialog: () => void;
	isDeleting: boolean;
	handleDelete: () => void;
}

const DeleteDialog: FC<DeleteDialogProps> = ({ openDialog, handleCloseDialog, isDeleting, handleDelete }) => {
	return (
		<Dialog
			open={openDialog}
			onClose={handleCloseDialog}
			aria-labelledby="delete-dialog-title"
			aria-describedby="delete-dialog-description"
		>
			<DialogTitle id="delete-dialog-title">Confirm Project Deletion</DialogTitle>
			<DialogContent>
				<DialogContentText id="delete-dialog-description">
					Are you sure you want to delete this project? This action cannot be undone.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDialog} color="primary" disabled={isDeleting}>
					Cancel
				</Button>
				<Button
					onClick={handleDelete}
					color="error"
					variant="contained"
					disabled={isDeleting}
				>
					{isDeleting ? <CircularProgress size={20} /> : "Delete"}
				</Button>
			</DialogActions>
		</Dialog>
	)
}


interface ProjectFormProps {
	project?: DetailedProjectDto,
	projectType: CreateProjectDtoProjectTypeEnum

}

const ProjectForm: FC<ProjectFormProps> = ({ project, projectType }) => {
	const router = useRouter()
	const updateProject = useUpdateProject()

	const [name, setName] = useState(project?.name || "");
	const [description, setDescription] = useState(project?.description || "");

	const [isDeleting, setIsDeleting] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [isNameValid, setIsNameValid] = useState(true);
	const [isCheckingName, setIsCheckingName] = useState(false);
	const [error, setError] = useState("");

	const handleOpenDialog = () => setOpenDialog(true);
	const handleCloseDialog = () => setOpenDialog(false);

	// Mock function to check name availability
	const checkNameAvailability = async (name: string) => {
		setIsCheckingName(true);
		// Simulate an API call
		const exitsPro = await SearchProjects(name)
		// Replace this logic with real API check
		const notAvailable = exitsPro && exitsPro.some(p => p.name === name) && (project ? project.name != name : true)
		setIsCheckingName(false);
		return !notAvailable;
	};

	const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setName(newName);
		if (newName) {
			const isAvailable = await checkNameAvailability(newName);
			setIsNameValid(isAvailable);
			if (!isAvailable) {
				setError("This project name is already taken or unavailable.");
			} else {
				setError("");
			}
		} else {
			setIsNameValid(true);
			setError("");
		}
	};

	const handleError = (error: any) => {
		if (error instanceof AxiosError) {
			if (error.response?.status === 409) {
				setError("This project name is already taken or unavailable.");
				setIsNameValid(false)
			}
			else {
				alert(error)
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name) {
			setError("Please fill in all required fields.");
			return;
		}
		if (!isNameValid) {
			setError("Please choose a valid project name.");
			return;
		}
		// Submit form data (API call)
		try {
			if (!project) {
				const res = await createProject({ name, description })
				router.push(R_PROJECTS + "/" + res.name + "/" + ProNavBarOption.OVERVIEW, undefined, { shallow: true })
			} else {
				updateProject.mutate({ projectName: project.name, data: { name, description } }, {
					onSuccess(data) {
						router.push(R_PROJECTS + "/" + data.name + "/" + ProNavBarOption.SETTINGS)
					},
					onError(error) {
						handleError(error)
					},
				})
			}
		} catch (error: any) {
			handleError(error)
		}
	};

	const handleDelete = async () => {
		if (project) {
			setIsDeleting(true);
			await deleteProject(project?.name)
			setIsDeleting(false);
			setOpenDialog(false);
			router.push(R_PROJECTS)
		}
	};

	return (

		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				width: 400,
				margin: "auto",
				mt: 4,
			}}
		>
			{projectType === "product"
				? <Typography variant="h5">{project ? "Edit Project" : "Create New Project"}</Typography>
				: <Typography variant="h5">{project ? "Edit Formation" : "Create New Formation"}</Typography>
			}
			{error && <Typography color="error">{error}</Typography>}
			<TextField
				label={`${projectType === "product" ? 'Project' : "Formation"} Name`}
				value={name}
				onChange={handleNameChange}
				error={!isCheckingName && !isNameValid}
				helperText={
					isCheckingName
						? "Checking availability..."
						: !isNameValid
							? "Project name is not available."
							: name.length ? "Project name is available." : ""
				}
				required
				sx={{
					"& label": {
						width: "fit-content"
					}
				}}
			/>
			<TextField
				label="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				multiline
				rows={3}
			/>
			<Button
				type="submit"
				variant="contained"
				color="primary"
				disabled={!isNameValid}
			>
				{isCheckingName ? <CircularProgress size={24} /> : project ? "Update Project" : "Create Project"}
			</Button>
			{project &&
				<Fragment>
					<Divider sx={{ my: 2 }} />
					<Box sx={{ textAlign: "center" }}>
						<Alert severity="warning" sx={{ mb: 2 }}>
							Deleting this project is a permanent action and cannot be undone.
						</Alert>
						<Button
							variant="outlined"
							color="error"
							onClick={handleOpenDialog}
						// disabled={isDeleting}
						>
							Delete Project
						</Button>
					</Box>
					<DeleteDialog
						openDialog={openDialog}
						handleCloseDialog={handleCloseDialog}
						isDeleting={isDeleting}
						handleDelete={handleDelete}
					/>
				</Fragment>}
		</Box>
	);
};

export default ProjectForm;
