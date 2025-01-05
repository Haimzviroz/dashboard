import { Maps, Map } from "@/types/interfaces"
import { Box, Divider, SxProps, Typography } from "@mui/material"
import { FC } from "react"
import MapItem from "./map-item"
import { useMaps } from "@/hooks"
import NoMaps from "../../assets/maps/no-maps.svg";

interface MapListPops {
  maps: Maps[] | Map[]
}

const style: SxProps = {
  width: 400,
  maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
  pt: 3,
  borderRightColor:"#00000020",
  borderRightStyle:"solid",
  borderRightWidth:"thin",
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    background: "#FFFFFF",
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#DBE1EC',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#9fb1d1'
  }
}



const MapList: FC<MapListPops> = ({ maps }) => {

  return (
    <Box sx={style}>
      <Typography variant="h4" sx={{ fontWeight: 600, px: 4, pb: 3 }}>תשתיות מיפוי</Typography>
      <Divider />
      <Box sx={{ px: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, pt: 4, mb: 1.5 }}>בולים בשימוש לאחרונה</Typography>
        {maps.length > 0
          ? maps?.map(map =>
            <MapItem key={map.catalogId} map={map}></MapItem>
          )
          : <Box sx={{ textAlign: "center" }}>
            <NoMaps />
            <Box>Empty state</Box>
          </Box>}
      </Box>
    </Box>
  )
}

export default MapList;