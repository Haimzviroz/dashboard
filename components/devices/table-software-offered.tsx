import { FC } from "react"
import { ColDataGrid, DataGridProps, GridProps, RowDataGrid } from "../data-grid/data-grid.interfaces"

import IdCell from "./table-cells/id.cell";
import DataGrid from "../data-grid/data-grid";
import DateTimeCell from "./table-cells/date.cell";
import StorageCell from "./table-cells/storage.cell";
import IsUpdateCell from "./table-cells/is-update.cell";
import { Button } from "@mui/material";
import NameCell from "./table-cells/name.cell";
import { Software, SoftwareState } from "@/types/interfaces/getapp";
import { useMutateDeviceSoftware } from "@/hooks/offering.query.hook";
import { DeviceSoftWare, ItemTypeEnum, PushOfferDto } from "@/types/interfaces/devices";

enum OfferedSoftwareTableCols {
  LABEL = "label",
  SELECT = "selected",
  ID = "catalogId",
  NAME = "name",
  VERSION = "version",
  UPLOAD_DATE = "uploadDate",
  SIZE = "size",
  IS_UPDATED = "isUpdated",
  PUSH_BTO = "pushBto",
}

interface SoftwareTableProps {
  device: DeviceSoftWare
  software: SoftwareState
  offerings: Software[]
}

const OfferedSoftwareTable: FC<SoftwareTableProps> = ({ offerings, software, device }) => {

  const mutateOffer = useMutateDeviceSoftware()

  const handlePushOfferCmd = (catalogId: string) => {
    const pushMas: { mes: PushOfferDto, parentCatalogId: string } = {
      parentCatalogId: software.software.catalogId,
      mes: {
        catalogId,
        devices: [device.id],
        groups: [],
        itemType: ItemTypeEnum.SOFTWARE
      }
    }
    mutateOffer.mutate(pushMas)
  }

  const getNestedHeaderProps = (id: OfferedSoftwareTableCols): ColDataGrid<OfferedSoftwareTableCols> | undefined => {
    switch (id) {
      case OfferedSoftwareTableCols.LABEL:
        return { id, headerName: "", sx: { minWidth: 24, maxWidth: { lg: 24 } } }
      case OfferedSoftwareTableCols.ID:
        return { id, headerName: "מזהה", sx: { minWidth: 75, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", /*position: "sticky", left: -120, bgcolor: "#FFF"*/ }, hide: true }
      case OfferedSoftwareTableCols.NAME:
        return { id, headerName: "תוכנה", sx: { minWidth: 50, maxWidth: 200, width: { lg: 200 }, overflow: "hidden", textOverflow: "ellipsis", /*position: "sticky", left: -120, bgcolor: "#FFF"*/ } }
      case OfferedSoftwareTableCols.VERSION:
        return { id, headerName: "גירסה", sx: { minWidth: 50, maxWidth: 150 } }
      case OfferedSoftwareTableCols.UPLOAD_DATE:
        return { id, headerName: "ת. העלאה", sx: { minWidth: 150 } }
      case OfferedSoftwareTableCols.SIZE:
        return { id, headerName: "גודל", sx: { minWidth: 75, } }
      case OfferedSoftwareTableCols.IS_UPDATED:
        return { id, headerName: "מעודכן", sx: { minWidth: 75, } }
      case OfferedSoftwareTableCols.PUSH_BTO:
        return { id, headerName: "", sx: { minWidth: 75, } }
      default:
        break;
    }
  }

  const getColData = () => {
    const columns: ColDataGrid<OfferedSoftwareTableCols>[] = []
    Object.values(OfferedSoftwareTableCols).forEach(key => {
      const isKey = getNestedHeaderProps(key)
      if (isKey && !isKey.hide) {
        columns.push(isKey)
      }
    })
    return columns
  }


  const getRowData = () => {
    const rows = offerings.map(offer => {
      let row: RowDataGrid<OfferedSoftwareTableCols> = {
        id: offer.catalogId,
        cells: {
          [OfferedSoftwareTableCols.LABEL]: null,
          [OfferedSoftwareTableCols.SELECT]: false,
          [OfferedSoftwareTableCols.ID]: <IdCell id={offer.catalogId} substring={true} />,
          [OfferedSoftwareTableCols.NAME]: <NameCell name={offer.name} />,
          [OfferedSoftwareTableCols.VERSION]: <NameCell name={offer.versionNumber} />,
          [OfferedSoftwareTableCols.UPLOAD_DATE]: <DateTimeCell date={offer.uploadDate} />,
          [OfferedSoftwareTableCols.SIZE]: <StorageCell status={offer.virtualSize} type="MB" />,
          [OfferedSoftwareTableCols.IS_UPDATED]: <IsUpdateCell status={offer.latest} />,
          [OfferedSoftwareTableCols.PUSH_BTO]: <Button onClick={() => { handlePushOfferCmd(offer.catalogId) }}>עדכן</Button>
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
      sx: { height: 64, py: 2, justifyContent: "flex-start", bgcolor: "rgba(189, 245, 198, .3)", paddingLeft: 10 }
    }
    return gridProps
  }

  const getTableData = (): DataGridProps<OfferedSoftwareTableCols> => {
    const columns = getColData()
    return {
      rows: getRowData(),
      columns,
      gridProps: getGridProps(columns.length),
    } as unknown as DataGridProps<OfferedSoftwareTableCols>
  }

  return (
    <DataGrid {...getTableData()}></DataGrid>
  )
}

export default OfferedSoftwareTable;

