import { FC, Fragment, useEffect, useRef } from "react";

import { Box, Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { ColDataGrid, GridProps, RowDataGrid } from "./data-grid.interfaces";

interface DataGridBodyProps<T extends string> {
  gridProps: GridProps,
  columns: ColDataGrid<T>[],
  rows: RowDataGrid<T>[],
}

const DataGridBody: FC<any> = <T extends string>({ gridProps, columns, rows }: DataGridBodyProps<T>) => {
  const childRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const setChildWidthAsParent = () => {
      if (parentRef.current && childRef.current) {
        const parentScrollWidth = parentRef.current.scrollWidth;
        if (parentScrollWidth) {
          childRef.current.style.width = `${parentScrollWidth}px`;
          // childRef.current.style.width = `${Math.max(parentScrollWidth, childRef.current.scrollWidth)}px`;
          // parentRef.current.style.width = `${Math.max(parentScrollWidth, childRef.current.scrollWidth)}px`;
        }
      }
    };
    //   console.log({
    //    boxScroll: parentRef.current?.scrollWidth,
    //    boxOffset: parentRef.current?.offsetWidth,
    //    gridScroll: childRef.current?.scrollWidth,
    //    gridOffset: childRef.current?.offsetWidth,
    //  });
    setChildWidthAsParent();

    // window.addEventListener('resize', setChildWidthAsParent);

    // return () => {
    //   window.removeEventListener('resize', setChildWidthAsParent);
    // };

  }, [])

  return (
    <Fragment>
      {!rows.length && gridProps.emptyRows ? gridProps.emptyRows : rows.map((row: RowDataGrid<T>, index: number) => (
        <Box ref={parentRef} key={row.id} >
          <div id={row.id} style={{ scrollMarginTop: `${(gridProps.sx as any).height}px` }}></div>
          <Grid container columns={gridProps.sumCols} wrap="nowrap" gap={gridProps.gap}
            sx={{
              borderBottom: "solid 1px #E0E0E0",
              minWidth: "100%",
              width: "fit-content",
              ...gridProps.sx
            }}
            onClick={row.onRowClick}
          >
            {columns.map(col => {
              const sx = { ...col.sx, ...row.sx }
              return (
                <Grid
                  key={col.id}
                  lg={gridProps.widthCol}
                  sx={sx}
                >{row.cells[col.id]}</Grid>
              )
            })}
          </Grid>
          <Box ref={childRef} sx={{ width: childRef?.current?.scrollWidth }}>
            {row.nestedRows && row?.isNestedOpen && row.nestedRows()}
          </Box>
        </Box>
      ))}
    </Fragment >
  );
}

export default DataGridBody;