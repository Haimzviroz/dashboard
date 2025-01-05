import { Box } from "@mui/material"
import { FC } from "react"
import ShowsMapWrapper from "./map-shows-wrap"


interface MapPresentedPops {

}

const DisplayMaps: FC<MapPresentedPops> = ({ }) => {
  return (
    <Box sx={{flexGrow: 1, m: 0, textAlign: "left" }}>
        <ShowsMapWrapper></ShowsMapWrapper>
    </Box>
  )
}

export default DisplayMaps;