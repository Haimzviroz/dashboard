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
import { addNewProject, SearchProjects } from '@/apis/client-side/projects-actions.api';
import { R_PROJECTS } from '@/apis/routes';
import { NavBarOption } from '@/types/enum';
import { useRouter } from 'next/router';
import { Project } from '@/types/interfaces';

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
	project?: Project
}

const ProjectForm: FC<ProjectFormProps> = ({ project }) => {
	const router = useRouter()

	const [isDeleting, setIsDeleting] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);

	const [name, setName] = useState(project?.name || "");
	const [description, setDescription] = useState(project?.description || "");
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
		const notAvailable = exitsPro && exitsPro.some(p => p.name === name)
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
			if(!project){
				const res = await addNewProject({ name, description })
				router.push(R_PROJECTS + "/" + res.name + "/" + NavBarOption.OVERVIEW)
			} else{

			}
		} catch (error) {
			alert(error)
		}
	};

	const handleDelete = async () => {
				setIsDeleting(true);
				// Simulate API delete call
				setTimeout(() => {
					setIsDeleting(false);
					setOpenDialog(false);
					// alert("Project deleted!");
					router.push(R_PROJECTS)
				}, 2000);
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
			<Typography variant="h5">{project ? "Edit Project" : "Create New Project"}</Typography>
			{error && <Typography color="error">{error}</Typography>}
			<TextField
				label="Project Name"
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
				disabled={isCheckingName}
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
