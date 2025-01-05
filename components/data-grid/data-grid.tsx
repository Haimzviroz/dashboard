import { Fragment } from "react";
import DataGridHead from "./data-grid-header";
import DataGridBody from "./data-grid-body";
import { DataGridProps, GridProps } from "./data-grid.interfaces";
import { Box } from "@mui/material";

const DataGrid = <T extends string>({ columns, rows, gridProps }: DataGridProps<T>) => {
  return (
    <Fragment>
      <DataGridHead gridProps={gridProps} columns={columns}></DataGridHead>
      <DataGridBody gridProps={gridProps} columns={columns} rows={rows}></DataGridBody>
    </Fragment>
  );
}

export default DataGrid;
