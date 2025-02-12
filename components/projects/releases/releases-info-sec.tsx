import { NextPageWithLayout } from '@/types/types';
import { Fragment, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Collapse, IconButton, Stack, Typography } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface RelInfoSecProps {
  sectionName: string;
  info: React.ReactNode;
}

const RelInfoSec: NextPageWithLayout<RelInfoSecProps> = ({ sectionName, info }) => {
  const [isExpanded, setIsExpanded] = useState(true);

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
          <Typography variant="subtitle1" fontWeight="bold">
            {sectionName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {info}
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default RelInfoSec;
