import { FC, useEffect, useState } from "react"
import { ColDataGrid, DataGridProps, GridProps, RowDataGrid } from "../data-grid/data-grid.interfaces"

import IdCell from "./table-cells/id.cell";
import { useDeviceSoftware } from "@/hooks/device.query.hook";
import DataGrid from "../data-grid/data-grid";
import DateTimeCell from "./table-cells/date.cell";
import StorageCell from "./table-cells/storage.cell";
import IsUpdateCell from "./table-cells/is-update.cell";
import { Button, LinearProgress } from "@mui/material";
import SoftwareStateCell from "./table-cells/software-state.cell";
import NameCell from "./table-cells/name.cell";
import OfferedSoftwareTable from "./table-software-offered";
import { DeviceSoftwareStateEnum } from "@/types/interfaces/getapp";

enum SoftwareTableCols {
  LABEL = "label",
  SELECT = "selected",
  ID = "catalogId",
  NAME = "name",
  VERSION = "version",
  DOWNLOAD_DATE = "downloadDate",
  INSTALL_DATE = "installDate",
  SIZE = "size",
  IS_UPDATED = "isUpdated",
  STATE = "state",
  OFFER_BTO = "mapBto",
}

interface SoftwareTableProps {
  id: string,
  cDevice: string
}

const SoftwareTable: FC<SoftwareTableProps> = ({ id, cDevice }) => {

  const [isOpenRow, setIsOpenRow] = useState<boolean>(false)
  const [openOffers, setOpenOffers] = useState<string>()
  const { device, isFetching } = useDeviceSoftware(id);

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


  const getNestedHeaderProps = (id: SoftwareTableCols): ColDataGrid<SoftwareTableCols> | undefined => {
    switch (id) {
      case SoftwareTableCols.LABEL:
        return { id, headerName: "", sx: { minWidth: 24, maxWidth: { lg: 24 } } }
      case SoftwareTableCols.ID:
        return { id, headerName: "מזהה", sx: { minWidth: 75, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", /*position: "sticky", left: -120, bgcolor: "#FFF"*/ }, hide: true }
      case SoftwareTableCols.NAME:
        return { id, headerName: "תוכנה", sx: { minWidth: 50, maxWidth: 200, width: { lg: 200 }, overflow: "hidden", textOverflow: "ellipsis", /*position: "sticky", left: -120, bgcolor: "#FFF"*/ } }
      case SoftwareTableCols.VERSION:
        return { id, headerName: "גירסה", sx: { minWidth: 50, maxWidth: 150 } }
      case SoftwareTableCols.DOWNLOAD_DATE:
        return { id, headerName: "ת. הורדה", sx: { minWidth: 150 } }
      case SoftwareTableCols.INSTALL_DATE:
        return { id, headerName: "ת. התקנה", sx: { minWidth: 150, } }
      case SoftwareTableCols.SIZE:
        return { id, headerName: "גודל", sx: { minWidth: 75, } }
      case SoftwareTableCols.IS_UPDATED:
        return { id, headerName: "מעודכן", sx: { minWidth: 75, } }
      case SoftwareTableCols.STATE:
        return { id, headerName: "סטאטוס", sx: { minWidth: 75, } }
      case SoftwareTableCols.OFFER_BTO:
        return { id, headerName: "", sx: { minWidth: 75, } }
      default:
        break;
    }
  }

  const getColData = () => {
    const columns: ColDataGrid<SoftwareTableCols>[] = []
    Object.values(SoftwareTableCols).forEach(key => {
      const isKey = getNestedHeaderProps(key)
      if (isKey && !isKey.hide) {
        columns.push(isKey)
      }
    })
    return columns
  }


  const getRowData = () => {
    const rows = device?.softwares.filter(s => s.state != DeviceSoftwareStateEnum.UNINSTALLED).map(software => {
      let row: RowDataGrid<SoftwareTableCols> = {
        id: software.software.id,
        cells: {
          [SoftwareTableCols.LABEL]: null,
          [SoftwareTableCols.SELECT]: false,
          [SoftwareTableCols.ID]: <IdCell id={software.software.id} substring={true} />,
          [SoftwareTableCols.NAME]: <NameCell name={software.software.projectName} />,
          [SoftwareTableCols.VERSION]: <NameCell name={software.software.version} />,
          [SoftwareTableCols.DOWNLOAD_DATE]: <DateTimeCell date={software.downloadDate} />,
          [SoftwareTableCols.INSTALL_DATE]: <DateTimeCell date={software.deployDate} />,
          [SoftwareTableCols.SIZE]: <StorageCell status={software.software.size} type="MB" />,
          [SoftwareTableCols.IS_UPDATED]: <IsUpdateCell status={software.software.latest} />,
          [SoftwareTableCols.STATE]: <SoftwareStateCell state={software.state} />,
          // [SoftwareTableCols.OFFER_BTO]: (!software.software.isLatest && software.offering?.length) ? <Button onClick={() => setOpenOffers(open => !open)}>עדכונים</Button> : null
          [SoftwareTableCols.OFFER_BTO]: (!software.software.latest) ? <Button onClick={() => setOpenOffers(open => open === software.software.id ? "" : software.software.id)}>עדכונים</Button> : null
        },
        isNestedOpen: openOffers === software.software.id,
        nestedRows: () => software.offering && <OfferedSoftwareTable offerings={software.offering} software={software} device={device} />
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
      sx: { height: 64, py: 2, justifyContent: "flex-start", bgcolor: "rgba(60, 85, 110, 0.03)", paddingLeft: 5 }
    }
    return gridProps
  }

  const getTableData = (): DataGridProps<SoftwareTableCols> => {
    const columns = getColData()
    return {
      rows: getRowData(),
      columns,
      gridProps: getGridProps(columns.length),
    } as unknown as DataGridProps<SoftwareTableCols>
  }

  return (
    <DataGrid {...getTableData()}></DataGrid>
  )
}

export default SoftwareTable;

