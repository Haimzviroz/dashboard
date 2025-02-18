import { FC, Fragment, useEffect } from 'react';


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
	DialogTitle,
	Autocomplete,
	Chip
} from "@mui/material";
import { createProject, deleteProject, getPlats, searchProjects } from '@/apis/client-side/projects-actions.api';
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
	const [platforms, setPlatforms] = useState<string[]>(project?.platforms ?? []);
	const [inputPlat, setInputPlat] = useState<string>();
	const [description, setDescription] = useState(project?.description || "");

	const [loading, setLoading] = useState(false);
	const [suggestedPlats, setSuggestedPlats] = useState<string[]>([]);

	const [isDeleting, setIsDeleting] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [isNameValid, setIsNameValid] = useState(true);
	const [isCheckingName, setIsCheckingName] = useState(false);
	const [error, setError] = useState("");

	const handleOpenDialog = () => setOpenDialog(true);
	const handleCloseDialog = () => setOpenDialog(false);

	const typeToString = () => {
		return projectType === "product" ? "Product" : "Formation"
	}

	const typeToLowerString = () => {
		return projectType === "product" ? "product" : "formation"
	}

	const fetchPlats = async (query: string) => {
		setLoading(true);
		try {
			const plats = await getPlats(query)
			setLoading(false);
			return plats
		} catch (error) {
			console.error(`Err getting all platforms: ${error}`);
			setLoading(false);
		}
	};

	const checkNameAvailability = async (name: string) => {
		setIsCheckingName(true);
		// Simulate an API call
		const exitsPro = await searchProjects(name)
		// Replace this logic with real API check
		const notAvailable = exitsPro && exitsPro.some(p => p.name === name) && (project ? project.name != name : true)
		setIsCheckingName(false);
		return !notAvailable;
	};

	const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setName(newName.split(" ").join("_"));
		if (newName) {
			const isAvailable = await checkNameAvailability(newName);
			setIsNameValid(isAvailable);
			if (!isAvailable) {
				setError(`This ${typeToLowerString()} name is already taken or unavailable.`);
			} else {
				setError("");
			}
		} else {
			setIsNameValid(true);
			setError("");
		}
	};

	const handlePlatChange = async (value: string | string[] | null) => {
		value ? setPlatforms(Array.isArray(value) ? value : [value]) : setPlatforms([]);
	};

	const handlePlatInputChange = async (value: string) => {
		const transformedValue = value.split(" ").join("-").toLowerCase();
		setInputPlat(transformedValue);
		if (value && value.length >= 2) {
			const plats = await fetchPlats(value);
			plats && setSuggestedPlats(plats)
		} else {
			setSuggestedPlats([]);
		}
	};

	const handleError = (error: any) => {
		if (error instanceof AxiosError) {
			if (error.response?.status === 409) {
				setError(`This ${typeToLowerString()} name is already taken or unavailable.`);
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
				const res = await createProject({ name, description, projectType, platforms })
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
				label={`${typeToString()} Name`}
				value={name}
				onChange={handleNameChange}
				error={!isCheckingName && !isNameValid}
				helperText={
					isCheckingName
						? "Checking availability..."
						: !isNameValid
							? `${typeToString()} name is not available.`
							: name.length ? `${typeToString()} name is available.` : ""
				}
				required
				sx={{
					"& label": {
						width: "fit-content"
					}
				}}
			/>

			<Autocomplete
				multiple={projectType === "product"}
				freeSolo
				options={suggestedPlats}
				loading={loading}
				value={projectType === "product" ? platforms : (platforms[0] ?? "")}
				inputValue={inputPlat ?? ""} // Ensure input is controlled properly
				onChange={(event, value) => handlePlatChange(value)}
				onInputChange={(event, newInputValue) => handlePlatInputChange(newInputValue)}
				renderTags={(value, getTagProps) => {
					return value.map((option, index) => (
						// eslint-disable-next-line
						<Chip label={option} {...getTagProps({ index })} />
					));
				}}
				renderOption={(props, option) => (
					<li {...props} style={{ width: "100%" }}>
						{option}
					</li>
				)}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Platform"
						variant="outlined"
						required={projectType === "formation"}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()
							}
						}}
					/>
				)}
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
				{isCheckingName ? <CircularProgress size={24} /> : project ? `Update ${typeToString()}` : `Create ${typeToString()}`}
			</Button>
			{project &&
				<Fragment>
					<Divider sx={{ my: 2 }} />
					<Box sx={{ textAlign: "center" }}>
						<Alert severity="warning" sx={{ mb: 2 }}>
							{`Deleting this ${typeToLowerString()} is a permanent action and cannot be undone.`}
						</Alert>
						<Button
							variant="outlined"
							color="error"
							onClick={handleOpenDialog}
						// disabled={isDeleting}
						>
							{`Delete ${typeToString()}`}
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
