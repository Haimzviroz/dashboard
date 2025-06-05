import { NextPageWithLayout } from '@/types/types';
import { ComponentType, Fragment, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, SvgIconProps, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface RelInfoSecProps {
  sectionName: string;
  info: React.ReactNode;
  icon: ComponentType<SvgIconProps>;
}

const RelInfoSec: NextPageWithLayout<RelInfoSecProps> = ({ sectionName, info, icon: Icon }) => {

  return (
    <Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            "& .MuiAccordionSummary-content.Mui-expanded": {
              m: 0
            }
          }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={.5}>
            <IconButton size='small'><Icon fontSize="small" sx={{ color: "#9575CD" }}/></IconButton>
            <Typography variant="subtitle1" fontWeight="bold">
              {sectionName}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {info}
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default RelInfoSec;
