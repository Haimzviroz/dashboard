import { MapPurpose, productMap } from "@/types/interfaces"
import { FC, Fragment, useEffect, useMemo, useState } from "react"
import { useMap, useMaps, useProducts } from "@/hooks"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { MapLayers } from "./map-utils/prepare-map-layers"
const ShowsMap = dynamic(() => import('@/components/maps/map-shows'), { ssr: false });

interface ShowsMapWrapperProps {

}

const ShowsMapWrapper: FC<ShowsMapWrapperProps> = ({ }) => {
  // const [currentProduct, setCurrentProduct] = useState<productMap>()
  // const [footPrint, setFootPrint] = useState<FootPrint>()
  
  const router = useRouter()
  const [layers, setLayers] = useState<MapLayers>()
  const [mapPurpose, setMapPurpose] = useState<MapPurpose>("nav")

  const products = useProducts({ enabled: !Boolean(router.query.catalogId) || mapPurpose == "draw" })
  const maps = useMaps(router.query.device as string)
  const { map: selectedMap } = useMap(router.query.catalogId as string, { enabled: Boolean(router.query.catalogId) })

  // const ShowsMap = useMemo(() => {
  //   return dynamic(() => import('@/components/maps/map-shows'), { ssr: false });
  // }, [])

  useEffect(() => {
    if (mapPurpose === "draw" && products) {
      setLayers(new MapLayers(maps.maps, selectedMap, products, "drawing"))
    } else {
      setLayers(new MapLayers(maps.maps, selectedMap, products))
    }
  }, [mapPurpose, selectedMap, products])

  // useEffect(() => {        
  //   if (selectedMap && products && products.status == "Success" && !Array.isArray(products.products)) {
  //     setCurrentProduct(products.products[selectedMap.product.id])
  //   }
  //   if (currentProduct) {
  //     setFootPrint(JSON.parse(currentProduct.footprint as unknown as string))
  //   } else {
  //     setLayers(new MapLayers(maps.maps, selectedMap, footPrint))
  //   }
  // }, [selectedMap, currentProduct, mapPurpose])

  // useEffect(() => {
  //   setLayers(new MapLayers(maps.maps, selectedMap, footPrint))
  // }, [footPrint])

  return (
    <Fragment>
      {<ShowsMap layers={layers} setLayers={setLayers} mapPurpose={mapPurpose} setMapPurpose={setMapPurpose} />}
    </Fragment>

  )
}

export default ShowsMapWrapper;