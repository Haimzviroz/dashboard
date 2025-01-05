import Grid from "@mui/material/Unstable_Grid2";
import { FC } from "react";
import { ColDataGrid, GridProps } from "./data-grid.interfaces";
import { Box, Divider } from '@mui/material';

interface DataGridHeadProps<CT> {
  gridProps: GridProps,
  columns: ColDataGrid<CT>[]

}

const DataGridHead: FC<any> = <T,>({ gridProps, columns }: DataGridHeadProps<T>) => {
  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1200, bgcolor: "#FFF"}}>
      <Grid container
        columns={gridProps.sumCols}
        wrap="nowrap"
        gap={gridProps.gap}
        sx={{
          borderBottom: "solid 1px #E0E0E0",
          minWidth: "100%",
          width: "fit-content",
          position: "sticky", top: 0, zIndex: 1200, bgcolor: "#FFF",
          ...gridProps.sx
        }}
        py={2} >
        {columns.map(col => (
          <Grid
            key={col.id as string}
            lg={gridProps.widthCol}
            sx={{ ...col?.sx }}
          >{col?.headerName}</Grid>
        ))}
      </Grid>
      {/* <Divider variant="fullWidth" /> */}
    </Box>
  );
}

export default DataGridHead;