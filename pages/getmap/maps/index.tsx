import GM_layout from "@/components/layout/GM-layout";
import { NextPageWithLayout } from "@/types/types";
import { ReactElement, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { SS_GetMapClient } from "@/apis/server-side/ss_gm-maps-client";
import { useMaps } from "@/hooks";
import { Maps as MapsL, ProductsRes } from "@/types/interfaces";
import MapList from "@/components/maps/map-list";
import { Box } from "@mui/material";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Q_MAPS, Q_PRODUCTS } from "@/apis/query-keys";
import { useRouter } from "next/router";
import DisplayMaps from "@/components/maps/map-presented";
import Logger from "@/services/logger";
import BodyBox from "@/components/body/body-box";


interface MapsProps {
  mapList: MapsL[]
  productList: ProductsRes
}

const Maps: NextPageWithLayout<MapsProps> = () => {
  const router = useRouter()
  const mapList = useMaps(router.query.device as string)

  return (
    <BodyBox>
      <Box sx={{ display: "flex" }}>
        {mapList.maps && <MapList maps={mapList.maps}></MapList>}
        {mapList.maps && mapList.maps?.length > 0 && <DisplayMaps></DisplayMaps>}
      </Box>
    </BodyBox>
  )
}

export default Maps;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const logger = Logger(Maps.name)
  logger.info("Get maps props")

  const httpClient = new SS_GetMapClient(context)
  const queryClient = new QueryClient();

  try {
    const mapList = await httpClient.getMapsByQ()
    const productList = await httpClient.getProducts()

    await Promise.allSettled([
      await queryClient.prefetchQuery({
        queryKey: [Q_MAPS, httpClient.getQuery("device")],
        queryFn: () => mapList
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_PRODUCTS],
        queryFn: () => productList
      }),
    ])

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      }
    }
  } catch (error: any) {
    return httpClient.pagesErrorHandler(error)
  }
}

Maps.getLayout = (page: ReactElement) => {
  return <GM_layout page={page} />
}