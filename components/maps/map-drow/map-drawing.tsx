import { CreateMap } from "@/types/interfaces/getmap/gm-api.interfaces";
import { LatLng, Rectangle, point } from "leaflet";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useCreateMap, useProducts } from "@/hooks";
import { DrawMapStatus, MapDrawForm } from "@/types/interfaces";
import DrawController from "./draw-controller";
import { MapLayers } from "../map-utils/prepare-map-layers";
import { MapHelpers } from "../map-utils/map-helpers";

interface DrawMapProps {
  setLayers: Dispatch<SetStateAction<MapLayers | undefined>>
}

const DrawMap: FC<DrawMapProps> = ({ setLayers }) => {
  const mutateMap = useCreateMap()
  const mapL = useMap()

  const [drawLayer, setDrawLayer] = useState<L.Polygon>()
  const [mapForm, setMapForm] = useState<MapDrawForm>({ name: "" })
  const [mapStatus, setMapStatus] = useState<DrawMapStatus>(DrawMapStatus.start)

  useEffect(() => {
    mapL?.on("pm:create", handleCreate);

    return () => {
      mapL?.off("pm:create", handleCreate);
      mapL?.pm.disableDraw("Polygon");
      mapL?.pm.disableGlobalEditMode();
    }

  }, [mapL])

  useEffect(() => {
    switch (mapStatus) {
      case DrawMapStatus.start:
        if (drawLayer) {
          mapL.removeLayer(drawLayer)
        }
        mapL?.pm.enableDraw("Polygon");
        break;
      case DrawMapStatus.created:
        drawLayer?.pm.enable();
        drawLayer?.on("pm:edit", handleEdit);
        break;

      default:
        break;
    }
  }, [drawLayer, mapStatus])

  const handleCreate = (e: { layer: Rectangle<any>; }) => {
    setDrawLayer(e.layer);
    setMapStatus(DrawMapStatus.created)
  };

  const handleEdit = (e: { layer: Rectangle<any>; }) => {
    setMapStatus(DrawMapStatus.edited)
  };

  const fromLatLngToLngLatArr = (point: LatLng): [number, number] => {
    return [point.lng, point.lat];
  };

  const latLngToNumberArr = (points: LatLng[] | LatLng[][] | LatLng[][][]): [number, number][] | [number, number][][] | [number, number][][][] => {
    if (points.length === 1) {
      return (points[0] as LatLng[]).map(p => fromLatLngToLngLatArr(p))
    } else {
      return (points as LatLng[][] | LatLng[][][]).map(p => latLngToNumberArr(p)) as [number, number][][] | [number, number][][][]
    }
  };

  const handleSubmit = async () => {
    mapL.pm.disableDraw()
    if (drawLayer) {
      // const bounds = drawLayer?.getBounds()
      // const bbox = []
      // bbox.push(bounds?.getWest())
      // bbox.push(bounds?.getSouth())
      // bbox.push(bounds?.getEast())
      // bbox.push(bounds?.getNorth())

      const points = drawLayer?.getLatLngs()
      const pointsArr = latLngToNumberArr(points) as [number, number][]
      pointsArr.push(pointsArr[0])

      const bull = new CreateMap(pointsArr.join(","), mapForm.name)
      mutateMap.mutate(bull)
    }

  }


  return (
    <DrawController
      mapForm={mapForm}
      setMapForm={setMapForm}
      mapStatus={mapStatus}
      setMapStatus={setMapStatus}
      handleSubmit={handleSubmit}
    ></DrawController>
  );
}

export default DrawMap;