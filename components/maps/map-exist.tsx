import { MapImportStatusEnum } from "@/types/enum/getmap";
import { FC, Fragment } from "react";
import { Polygon } from "react-leaflet";
import { MapLayers } from "./map-utils/prepare-map-layers";
import { LatLngExpression } from "leaflet";

interface ExistMapsProps {
  layers: MapLayers
}

const ExistLayers: FC<ExistMapsProps> = ({ layers }) => {

  const getPathColor = () => {
    let color
    switch (layers.selectedMap?.status) {
      case MapImportStatusEnum.START:
        color = "#14ede1"
        break;
      case MapImportStatusEnum.IN_PROGRESS:
        color = "#d8b6ef"
        break;
      case MapImportStatusEnum.DONE:
        color = "#2979FF"
        break;
      case MapImportStatusEnum.ERROR:
        color = "#ef1b1b"
        break;
      case MapImportStatusEnum.CANCEL:
        color = "#ef841b"
        break;
      default:
        color = "#051af3"
        break;
    }
    return color
  }

  return (
    <Fragment>
      {/* {layers?.fullBbox && <Polygon pmIgnore={true} pathOptions={{ color: getPathColor(), fillOpacity: 0.1, dashArray: '5, 2', weight: 1 }} positions={layers.fullBbox} />} */}
      {/* {layers?.footPrint?.bbox && <Polygon pathOptions={{ color: "#f3399a", fillOpacity: 0.1 }} positions={layers.footPrint.bbox as any} />}
      {layers?.footPrint?.coordinates && <Polygon pathOptions={{ color: "#f3399a", fillOpacity: 0.1 }} positions={layers.footPrint.coordinates as any} />} */}
      {/* {layers?.mapss && <Polygon pathOptions={{ color: "#f13176", fillOpacity: 0, stroke: true, weight:1.5}} positions={layers.mapss} />} */}
      
      {layers?.products && <Polygon pathOptions={{ color: "#f13176", fillOpacity: 0, stroke: true, weight: 1.5 }} positions={layers.products} />}
      {layers?.mapsPoints && layers.mapsPoints.map((m, i) => <Polygon key={i} pmIgnore={true} pathOptions={{ color: getPathColor(), fillOpacity: 0, weight: 1 }} positions={m as LatLngExpression[]} />)}
    </Fragment>);
}

export default ExistLayers;