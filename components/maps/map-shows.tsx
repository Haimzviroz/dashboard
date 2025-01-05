import { Dispatch, FC, SetStateAction, useEffect } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { TileLayer, useMap, MapContainer } from "react-leaflet"

import ExistLayers from "./map-exist";
import DrawMap from "./map-drow/map-drawing";
import DrawToggle from "./map-utils/draw-toggle";

import { MapLayers } from "./map-utils/prepare-map-layers";
import { MapPurpose } from "@/types/interfaces";

interface MapControllerProps {
  layers: MapLayers | undefined
}

const MapController: FC<MapControllerProps> = ({ layers }) => {
  let map = useMap()

  useEffect(() => {
    const sizeInternal = setInterval(() => {
      map?.invalidateSize()
    }, 1000)

    return () => {
      clearInterval(sizeInternal)
    }
  }, [])

  useEffect(() => {
    layers?.center && map.setView(layers.center)
  }, [layers])

  return null
}


interface ShownMapProps {
  layers: MapLayers | undefined,
  setLayers: Dispatch<SetStateAction<MapLayers | undefined>>
  mapPurpose: MapPurpose
  setMapPurpose: Dispatch<SetStateAction<MapPurpose>>
}

const ShowsMap: FC<ShownMapProps> = ({ layers, setLayers, mapPurpose, setMapPurpose }) => {
  // const [map, setMap] = useState<Map | null>(null)


  return (
    <MapContainer
      // ref={(mapRef => setMap(mapRef))}
      key={layers?.selectedMap ? layers.selectedMap.catalogId : "all"}
      style={{ height: "calc(100vh - 72px)", width: "100%", overflow: "hidden" }}
      center={layers?.center ?? { "lat": 32.153464035661194, "lng": 34.88491667228661 }}
      zoom={10}
      scrollWheelZoom={true}
      zoomControl={false}
    >

      <MapController layers={layers} />

      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DrawToggle purpose={mapPurpose} setPurpose={setMapPurpose}></DrawToggle>

      {layers && <ExistLayers layers={layers}></ExistLayers>}
      {/* {layers && mapPurpose == "nav" && <ExistLayers layers={layers}></ExistLayers>} */}
      {mapPurpose == "draw" && <DrawMap setLayers={setLayers}></DrawMap>}

    </MapContainer>
  )
}

export default ShowsMap;
