import { ReactElement } from 'react';

import GA_layout from '@/components/layout/GA-layout';
import GlobalProvider from '@/storage/global.storage';

import React from "react";
import {
	Box,
} from "@mui/material";
import LTR_MuiProvider from '@/providers/ltr-mui.provider';
import ProjectForm from '@/components/projects/projects/project-form';
import { CreateProjectDtoProjectTypeEnum } from '@/api/src';

const NewProjectForm = () => {

	return (
		<ProjectForm projectType={CreateProjectDtoProjectTypeEnum["Product"]}/>
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