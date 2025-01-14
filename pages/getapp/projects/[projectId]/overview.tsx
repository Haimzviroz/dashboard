import { Fragment, ReactElement, useState } from 'react';
import { GetServerSidePropsContext } from 'next';

// import NavBar from '@/components/header/navigation';

import { Project as Projects } from '@/types/interfaces';
import { NextPageWithLayout } from '@/types/types';


import { SS_ProjectsClient } from '@/apis/server-side/ss_projects-client';
import GA_layout from '@/components/layout/GA-layout';
import { Box } from '@mui/material';
import NavBar from '@/components/header/navigation';

interface ManagementProjectsPageProps {
  allProjects: Projects[],
  currentProject: Projects,
  invitedProjects: Projects[]
}

const ManagementProjectsPage: NextPageWithLayout<ManagementProjectsPageProps> = ({ allProjects, currentProject, invitedProjects }) => {
  const [value, setValue] = useState(44);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>/dfdf</Fragment>
    // <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
    //   <Tabs value={value} onChange={handleChange} role="navigation" sx={{textTransform: 'none'}}>
    //     <Tab label="Item One" value={44} sx={{textTransform: 'none'}}/>
    //     <Tab label="Item Two" />
    //     <Tab label="Item Three" />
    //   </Tabs>
    // </Box>
  );
}

export default ManagementProjectsPage


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const params = ctx.params?.projectId
  const httpClient = new SS_ProjectsClient(ctx)

  try {

    // const currentProject = res?.projects?.find((p: Projects) => p.id.toString() === params)
    // if (!allProjects.length || !currentProject) {
    //   return { notFound: true };
    // }
    return {
      props: {
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

ManagementProjectsPage.getLayout = (page: ReactElement) => {
  return <GA_layout page={page} >
    <Box sx={{ direction: "rtl", padding: 2 }}>
      <NavBar />
      {page}
    </Box>
  </GA_layout>
}