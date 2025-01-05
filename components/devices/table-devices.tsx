import { Box, Button, Typography } from "@mui/material";
import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react"
import { Device } from "@/types/interfaces/devices";
import { ColDataGrid, DataGridProps, GridProps, RowDataGrid } from "../data-grid/data-grid.interfaces"

import { useRouter } from "next/router";
import IdCell from "./table-cells/id.cell";
import LabelCell from "./table-cells/label.cell";
import MapTable from "./table-map";
import DataGrid from "../data-grid/data-grid";
import BatteryCell from "./table-cells/buttery.cell";
import StorageCell from "./table-cells/storage.cell";
import BandwidthCell from "./table-cells/bandwidth.cell";
import OsCell from "./table-cells/os.cell";
import TextCell from "./table-cells/text.cell";
import DateTimeCell from "./table-cells/date.cell";
import DeviceControlBar from "./device-contrall-bar";
import MutNameCell from "./table-cells/nut-name.cell";
import SoftwareTable from "./table-software";
import { AppScopeEnum } from "@/types/enum";
import { useGetApp } from "@/hooks";
import SelectCell from "./table-cells/select.cell";
import { Map } from "@/types/interfaces";
import { Software } from "@/types/interfaces/getapp";

enum DeviceTableCols {
  SELECT = "selected",
  LABEL = "label",
  ID = "id",
  NAME = "name",
  OS = "OS",
  MEAN = "mean",
  UNIT = "unit",
  BANDWIDTH = "bandwidth",
  POWER = "power",
  STORAGE = "availableStorage",
  UPDATE_DATE = "updateDate",
  MAP_BTO = "mapBto",
}

interface DevicesTableProps {
  devices: Device[]
  setToggle?: Dispatch<SetStateAction<boolean>>
  mode: "page" | "modal",
  scope: AppScopeEnum
  mapId?: string,
  dEntity?: Software | Map
}

const DevicesTable: FC<DevicesTableProps> = ({ devices, mode, mapId, scope, dEntity }) => {

  const { router } = useGetApp()

  const [cDevice, setC_Device] = useState<string>(router.asPath.split('#')[1])
  const [distributeEntity,] = useState<string | undefined>(dEntity?.catalogId)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const handleSelectAllDevices = (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
    const isChecked = e.target.checked;

    setSelectedDevices(current => {
      if (!id) return isChecked ? ["all"] : [];

      const currentSet = new Set(current);

      isChecked ? currentSet.add(id) : currentSet.delete(id);

      return currentSet.size === devices.length ? ["all"] : Array.from(currentSet.has("all") ? devices.map(d => d.id).filter(d => d !== id) : currentSet);
    });
  };


  const getHeaderProps = (id: DeviceTableCols): ColDataGrid<DeviceTableCols> | undefined => {
    switch (id) {
      case DeviceTableCols.LABEL:
        return { id, headerName: "", sx: { minWidth: 24, maxWidth: { lg: 24 } } }
      case DeviceTableCols.SELECT:
        return { id, headerName: <SelectCell isSelect={selectedDevices.some(d => d === "all")} onChange={(e) => handleSelectAllDevices(e)} />, sx: { minWidth: 24, maxWidth: { lg: 24 } }, hide: !distributeEntity || !devices.length }
      case DeviceTableCols.ID:
        return { id, headerName: "מזהה", sx: { minWidth: 75, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", /*position: "sticky", left: -120, bgcolor: "#FFF"*/ } }
      case DeviceTableCols.NAME:
        return { id, headerName: "שם", sx: { minWidth: 125 } }
      case DeviceTableCols.OS:
        return { id, headerName: "מ. הפעלה", sx: { minWidth: 150, } }
      case DeviceTableCols.MEAN:
        return { id, headerName: "אמצעי", sx: { minWidth: 150, }, hide: true }
      case DeviceTableCols.UNIT:
        return { id, headerName: "יחידה", sx: { minWidth: 150, }, hide: false }
      case DeviceTableCols.BANDWIDTH:
        return { id, headerName: "חיבור לרשת", sx: { minWidth: 150, } }
      case DeviceTableCols.POWER:
        return { id, headerName: "מצב סוללה", sx: { minWidth: 150, } }
      case DeviceTableCols.STORAGE:
        return { id, headerName: "זכרון פנוי", sx: { minWidth: 150, } }
      case DeviceTableCols.UPDATE_DATE:
        return { id, headerName: "ת. עדכון אחרון", sx: { minWidth: 150, } }
      case DeviceTableCols.MAP_BTO:
        return { id, headerName: "", sx: { minWidth: 75, } ,hide: scope !== AppScopeEnum.getmap}
      default:
        break;
    }
  }

  const getEmptyRowsBody = () => {

  }

  const getColData = () => {
    const columns: ColDataGrid<DeviceTableCols>[] = []
    Object.values(DeviceTableCols).forEach(key => {
      const isKey = getHeaderProps(key)
      if (isKey && !isKey.hide) {
        columns.push(isKey)
      }
    })
    return columns
  }

  const getRowData = () => {
    const rows: RowDataGrid<DeviceTableCols>[] = devices.map(device => {
      const isSelect = selectedDevices.some(d => (d === "all" || d === device.id))
      let row: RowDataGrid<DeviceTableCols> = {
        id: device.id,
        cells: {
          [DeviceTableCols.LABEL]: <LabelCell id={device.id} mode={mode} setC_Device={setC_Device} cDevice={cDevice} />,
          [DeviceTableCols.SELECT]: <SelectCell isSelect={isSelect} onChange={(e) => handleSelectAllDevices(e, device.id)}></SelectCell>,
          [DeviceTableCols.ID]: <IdCell id={device.uid ? "צ " + device.uid : device.id} substring={device.uid ? false : true} />,
          [DeviceTableCols.NAME]: <MutNameCell deviceId={device.id} name={device.name} mapId={mapId} />,
          [DeviceTableCols.OS]: <OsCell os={device.OS} />,
          [DeviceTableCols.MEAN]: <TextCell text={"-"} />,
          [DeviceTableCols.UNIT]: <TextCell text={device.groupName ?? "-"} />,
          [DeviceTableCols.BANDWIDTH]: <BandwidthCell status={device.bandwidth as unknown as number} />,
          [DeviceTableCols.POWER]: <BatteryCell status={device.power} />,
          [DeviceTableCols.STORAGE]: <StorageCell status={device.availableStorage as unknown as number} type="GB"></StorageCell>,
          [DeviceTableCols.UPDATE_DATE]: <DateTimeCell date={device.lastUpdatedDate} />,
          [DeviceTableCols.MAP_BTO]: <Button onClick={() => router.push(`/getmap/maps/?device=${device.id}`)}>הצג מפות</Button>
        },
        // onRowClick: () => { return router.push(`/getmap/maps/?device=${device.id}`) },
        isNestedOpen: cDevice == device.id,
        nestedRows: () => scope === AppScopeEnum.getapp ? <SoftwareTable id={device.id} cDevice={cDevice} /> : <MapTable id={device.id} cDevice={cDevice} />
      };
      return row;
    })
    return rows
  }

  const getGridProps = (colsLength: number) => {
    const gridProps: GridProps = {
      // emptyRows: getEmptyRowsBody(),
      sumCols: 100,
      widthCol: Math.floor(100 / colsLength),
      gap: 2,
      withNested: true,
      sx: { height: 64, py: 2, justifyContent: "flex-start", alignItems: "center" },
    }
    return gridProps
  }

  const getTableData = (): DataGridProps<DeviceTableCols> => {
    const columns = getColData()
    return {
      rows: getRowData(),
      columns,
      gridProps: getGridProps(columns.length),
    }
  }

  return (
    <Fragment>
      <DeviceControlBar selectedDevices={selectedDevices} devices={devices} scope={scope} distributeEntity={distributeEntity} />
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        {/* <Box sx={{ width: "100%", height: "calc(100vh - 375px)", overflow: "auto" }}> */}
        <DataGrid {...getTableData()}></DataGrid>
      </Box>
    </Fragment>
  )
}

export default DevicesTable;

