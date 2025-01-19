import { ReactElement } from 'react';

import GA_layout from '@/components/layout/GA-layout';
import GlobalProvider from '@/storage/global.storage';

import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	CircularProgress,
} from "@mui/material";
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import { addNewProject, SearchProjects } from '@/apis/client-side/projects-actions.api';
import { R_PROJECTS } from '@/apis/routes';
import { NavBarOption } from '@/types/enum';
import { useRouter } from 'next/router';

const NewProjectForm = () => {
	const router = useRouter()

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isNameValid, setIsNameValid] = useState(true);
	const [isCheckingName, setIsCheckingName] = useState(false);
	const [error, setError] = useState("");

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
			const res = await addNewProject({ name, description })
			router.push(R_PROJECTS + "/" + res.name + "/" + NavBarOption.OVERVIEW)
		} catch (error) {
			alert(error)
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
			<Typography variant="h5">Create New Project</Typography>
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
							: "Project name is available."
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
				{isCheckingName ? <CircularProgress size={24} /> : "Create Project"}
			</Button>
		</Box>
	);
};

export default NewProjectForm;


NewProjectForm.getLayout = (page: ReactElement) => {
	return (
		<GA_layout page={page} >
			<GlobalProvider>
				<LTR_MuiProvider>
					<Box sx={{ padding: 2 }}>
						{/* <NavBar /> */}
						{page}
					</Box>
				</LTR_MuiProvider>
			</GlobalProvider>
		</GA_layout>
	)
}