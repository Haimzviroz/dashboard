import { Maps } from "@/types/interfaces"
import { Box, Button, Collapse, Icon, Stack, SxProps, Typography } from "@mui/material"
import { FC, useEffect, useRef, useState } from "react"
import Urban from "../../assets/maps/urban.svg";
import { useMap } from "@/hooks";
import Modal from '@/components/modal/modal';
import { useRouter } from 'next/router';
import DevicesTable from "../devices/table-devices";
import { DateHelpers } from "@/utils/helpers/date.helper";
import { StorageHelpers } from "@/utils/helpers/storage.helper";
import { MapImportStatusEnum } from "@/types/enum/getmap";
import MapNameHandler from "./map-item-name-handler";
import { AppScopeEnum } from "@/types/enum";
import { R_MAP_DEVICES } from '@/apis/routes';



interface MapItemPops {
  map: Maps

}
const boxStyle: SxProps = {
  border: 1,
  borderColor: "#DBE1EC",
  borderRadius: 2,
  my: 1,
  padding: 2,
  marginRight: .5,
  width: 300,
  cursor: "pointer"
}

const MapItem: FC<MapItemPops> = ({ map }) => {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const currentMap = useMap(map.catalogId, { enabled: false })

  const [isCollapse, setIsCollapse] = useState<boolean>(router.query.catalogId == map.catalogId || (map.isCollapsed ?? false))
  const [devicesToggle, setDevicesToggle] = useState<boolean>(false)

  useEffect(() => {
    map.isCollapsed = isCollapse
  }, [])

  useEffect(() => {
    if (router.query.catalogId == map.catalogId && mapRef.current) {
      mapRef.current.scrollIntoView({behavior: "smooth", block: "center"})
    }
  }, [router])

  const getParamsCatalogId = () => {
    return router.query.catalogId
  }

  const handleItemClick = () => {
    setIsCollapse(!isCollapse)
    map.isCollapsed = isCollapse
  }

  const handleDeviceClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    !currentMap.map && await currentMap.refetch()
    setDevicesToggle(true)
  }
  
  const handleDistributionClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    router.push(R_MAP_DEVICES + "?map=" + map.catalogId)
  }

  const handleShowClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    !currentMap.isFetched && await currentMap.refetch()
    setRouter();
  }

  const setRouter = () => {
    const device = router.query.device ? `?device=${router.query.device}` : ""
    router.push('/getmap/maps/[catalogId]', `/getmap/maps/${map.catalogId}${device}`, { shallow: true });
  }

  const getBgColor = () => {
    return map.catalogId == getParamsCatalogId() ? "rgba(136, 177, 246, 0.2)" : "";
  }

  const getMapStatus = (status: MapImportStatusEnum) => {
    let text: string;
    switch (status) {
      case MapImportStatusEnum.START:
        text = "בקשה"
        break;
      case MapImportStatusEnum.IN_PROGRESS:
        text = "בהפקה"
        break;
      case MapImportStatusEnum.DONE:
        text = "הופק"
        break;
      case MapImportStatusEnum.ERROR:
        text = "שגיאה"
        break;
      case MapImportStatusEnum.CANCEL:
        text = "בוטל"
        break;
      case MapImportStatusEnum.ARCHIVED:
        text = "ארכיון"
        break;
      case MapImportStatusEnum.EXPIRED:
        text = "פג תוקף"
        break;
      case MapImportStatusEnum.PENDING:
        text = "ממתין להפקה"
        break;
      case MapImportStatusEnum.PAUSED:
        text = "הושהה"
        break;
    }
    return text
  }

  const getMapName = () => {
    return map.name ? map.name : map.catalogId.substring(map.catalogId.length - 4)
  }

  return (
    <Box ref={mapRef} sx={{ ...boxStyle, backgroundColor: getBgColor() }} onClick={() => { handleItemClick() }}>
      <Stack direction={"row"} justifyContent={"space-between"} sx={{ pb: isCollapse ? 2 : 0 }}>
        <Stack direction={"row"} gap={1}>
          <Icon><Urban /></Icon>
          <Typography variant="body1">{getMapName()}</Typography>
        </Stack>
        <MapNameHandler name={getMapName()} mapId={map.catalogId} />
      </Stack>
      <Collapse in={isCollapse} sx={{ bgcolor: "#3C556E0F", mx: -2, mb: -2, p: 2, pt: 0 }}>
        <Stack direction={"row"} gap={2} sx={{ p: 2 }} justifyContent={"center"}>
          <Box sx={{ bgcolor: "#FFF", borderRadius: 2, p: 1, width: 90, textAlign: "center" }}>
            <Typography variant="caption" color={"#7F8694"}>נפח</Typography>
            <Typography variant="body1">{StorageHelpers.getSizeInShownFormat("MB", map.size)}</Typography>
          </Box>
          <Box sx={{ bgcolor: "#FFF", borderRadius: 2, p: 1, width: 90, textAlign: "center" }}>
            <Typography variant="caption" color={"#7F8694"}>סטאטוס</Typography>
            <Typography variant="body1">{getMapStatus(map.status)}</Typography>
          </Box>
        </Stack>
        <Stack direction={"column"} gap={2} sx={{ pb: 2 }} justifyContent={"center"}>
          <Box >
            <Typography variant="caption" color={"#7F8694"}>זמן צילום השטח:</Typography>
            <Typography variant="body1">{DateHelpers.textFormatOfDate(map.product.imagingTimeEndUTC)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color={"#7F8694"}>זמן בקשת הבול:</Typography>
            <Typography variant="body1">{DateHelpers.textFormatOfDate(map.createDate)}</Typography>
          </Box>
          <Box >
            <Typography variant="caption" color={"#7F8694"}>זמן הפקת הבול:</Typography>
            <Typography variant="body1">{DateHelpers.textFormatOfDate(map.exportEndDate)}</Typography>
          </Box>
        </Stack>
        <Stack direction={"row"} gap={2} >
          <Button variant="contained" onClick={(e: React.MouseEvent<HTMLElement>) => { handleDeviceClick(e) }}>אמצעי קצה</Button>
          <Button variant="contained" onClick={(e: React.MouseEvent<HTMLElement>) => { handleDistributionClick(e) }}>הפצה</Button>
          {map.catalogId != getParamsCatalogId() &&
            <Button variant="outlined" onClick={(e: React.MouseEvent<HTMLElement>) => { handleShowClick(e) }}>מקד מפה</Button>
          }
        </Stack>
      </Collapse>
      <Modal toggle={devicesToggle} setToggle={setDevicesToggle}>
        {currentMap?.map && currentMap.map.devices.length > 0 ?
          <DevicesTable devices={currentMap?.map.devices} mode="modal" mapId={map.catalogId} setToggle={setDevicesToggle} scope={AppScopeEnum.getmap}></DevicesTable>
          : <Box display={"flex"} justifyContent={"center"}>לא קיים אמצעים </Box>}
      </Modal>
    </Box>
  )
}

export default MapItem;