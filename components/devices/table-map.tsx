import { FC, useEffect, useState } from "react"
import { ColDataGrid, DataGridProps, GridProps, RowDataGrid } from "../data-grid/data-grid.interfaces"

import IdCell from "./table-cells/id.cell";
import { useDeviceMap } from "@/hooks/device.query.hook";
import DataGrid from "../data-grid/data-grid";
import { useRouter } from "next/router";
import DateTimeCell from "./table-cells/date.cell";
import StorageCell from "./table-cells/storage.cell";
import IsUpdateCell from "./table-cells/is-update.cell";
import MapStateCell from "./table-cells/map-state.cell";
import { Button, LinearProgress } from "@mui/material";
import { DeviceMapStateEnum } from "@/types/interfaces";
import NameCell from "./table-cells/name.cell";

enum MapTableCols {
  LABEL = "label",
  SELECT = "selected",
  ID = "catalogId",
  NAME = "name",
  PHOTO_DATE = "photoDate",
  REQ_DATE = "reqDate",
  PROD_DATE = "productionDate",
  SIZE = "size",
  IS_UPDATED = "isUpdated",
  STATE = "state",
  MAP_BTO = "mapBto",
}

interface MapTableProps {
  id: string,
  cDevice: string
}

const MapTable: FC<MapTableProps> = ({ id, cDevice }) => {

  const router = useRouter()

  const { device, isFetching } = useDeviceMap(id);

  const [isOpenRow, setIsOpenRow] = useState<boolean>(false)

  useEffect(() => {
    setIsOpenRow(cDevice == id)
  }, [])

  // useEffect(() => {
  //   if (device) {
  //     window.location.hash = id
  //   }
  // }, [device])


  if (!isOpenRow) return null
  if (!device && isFetching) return <LinearProgress />

  const getNestedHeaderProps = (id: MapTableCols): ColDataGrid<MapTableCols> | undefined => {
    switch (id) {
      case MapTableCols.LABEL:
        return { id, headerName: "", sx: { minWidth: 24, maxWidth: { lg: 24 } } }
      case MapTableCols.ID:
        return { id, headerName: "מפה", sx: { minWidth: 50, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", /*position: "sticky", left: -120, bgcolor: "#FFF"*/ }, hide: true }
      case MapTableCols.NAME:
        return { id, headerName: "מפה", sx: { minWidth: 50, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", /*position: "sticky", left: -120, bgcolor: "#FFF"*/ } }
      case MapTableCols.PHOTO_DATE:
        return { id, headerName: "ת. צילום", sx: { minWidth: 150 }, hide: true }
      case MapTableCols.REQ_DATE:
        return { id, headerName: "ת. בקשה", sx: { minWidth: 150, } }
      case MapTableCols.PROD_DATE:
        return { id, headerName: "ת. הפקה", sx: { minWidth: 150, } }
      case MapTableCols.SIZE:
        return { id, headerName: "גודל", sx: { minWidth: 75, } }
      case MapTableCols.IS_UPDATED:
        return { id, headerName: "מעודכן", sx: { minWidth: 75, } }
      case MapTableCols.STATE:
        return { id, headerName: "סטאטוס", sx: { minWidth: 75, } }
      case MapTableCols.MAP_BTO:
        return { id, headerName: "", sx: { minWidth: 75, } }
      default:
        break;
    }
  }

  const getColData = () => {
    const columns: ColDataGrid<MapTableCols>[] = []
    Object.values(MapTableCols).forEach(key => {
      const isKey = getNestedHeaderProps(key)
      if (isKey && !isKey.hide) {
        columns.push(isKey)
      }
    })
    return columns
  }


  const getRowData = () => {
    const rows = device?.maps.filter(s => s.state != DeviceMapStateEnum.UNINSTALLED).map(map => {
      let row: RowDataGrid<MapTableCols> = {
        id: map.map.catalogId,
        cells: {
          [MapTableCols.LABEL]: null,
          [MapTableCols.SELECT]: false,
          [MapTableCols.ID]: <IdCell id={map.map.catalogId} substring={true} />,
          [MapTableCols.NAME]: <NameCell name={map.map.name} />,
          [MapTableCols.PHOTO_DATE]: <DateTimeCell date={map.map?.product?.imagingTimeEndUTC} />,
          [MapTableCols.REQ_DATE]: <DateTimeCell date={map.map?.createDate} />,
          [MapTableCols.PROD_DATE]: <DateTimeCell date={map.map?.exportEndDate} />,
          [MapTableCols.SIZE]: <StorageCell status={map.map.size} type="MB" />,
          [MapTableCols.IS_UPDATED]: <IsUpdateCell status={map.map.isUpdate} />,
          [MapTableCols.STATE]: <MapStateCell state={map.state} />,
          [MapTableCols.MAP_BTO]: <Button onClick={() => router.push(`/getmap/maps/${map.map.catalogId}`)}>הצג מפה</Button>
        },
      };
      return row;
    })
    return rows
  }

  const getGridProps = (colsLength: number) => {
    const gridProps: GridProps = {
      sumCols: 100,
      widthCol: Math.floor(100 / colsLength),
      gap: 2,
      sx: { height: 64, py: 2, justifyContent: "flex-start", bgcolor: "rgba(60, 85, 110, 0.03)" }
    }
    return gridProps
  }

  const getTableData = (): DataGridProps<MapTableCols> => {
    const columns = getColData()
    return {
      rows: getRowData(),
      columns,
      gridProps: getGridProps(columns.length),
    } as unknown as DataGridProps<MapTableCols>
  }

  return (
    <DataGrid {...getTableData()}></DataGrid>
  )
}

export default MapTable;

