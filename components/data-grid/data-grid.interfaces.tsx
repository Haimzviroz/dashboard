import { SxProps } from "@mui/material";
import { ReactNode } from "react";

export interface GridProps {
  emptyRows?: ReactNode
  sumCols: number,
  widthCol: number
  gap?: number,
  withNested?: boolean,
  sx?: SxProps
}

export interface ColDataGrid<CT> {
  id: CT,
  headerName: string | ReactNode
  sx?: SxProps
  hide?: boolean
  sort?: boolean
}

export interface RowDataGrid<RT extends string> {
  id: string
  cells: { [K in RT]?: string | ReactNode }
  nestedRows?: () => ReactNode
  isNestedOpen?: boolean | (() => boolean)
  sx?: SxProps,
  onRowClick?: () => {}
}

export interface DataGridProps<T extends string> {
  columns: ColDataGrid<T>[]
  rows: RowDataGrid<T>[]
  gridProps?: GridProps
}