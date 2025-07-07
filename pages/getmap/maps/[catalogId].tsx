import GM_layout from "@/components/layout/GM-layout";
import { NextPageWithLayout } from "@/types/types";
import { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { SS_GetMapClient } from "@/apis/server-side/ss_gm-maps-client";
import { useMaps } from "@/hooks";
import { Map, Maps as MapsL, ProductsRes } from "@/types/interfaces";
import MapList from "@/components/maps/map-list";
import { Box } from "@mui/material";
import DisplayMaps from "@/components/maps/map-presented";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Q_MAP, Q_MAPS, Q_PRODUCTS } from "@/apis/query-keys";
import { useRouter } from "next/router";
import BodyBox from "@/components/body/body-box";

interface MapsProps {
  mapList: MapsL[]
  map: Map
  productList: ProductsRes
}

const Maps: NextPageWithLayout<MapsProps> = () => {
  const router = useRouter()
  const mapList = useMaps(router.query.device as string)

  return (
    <Box sx={{ display: "flex" }}>
      {mapList.maps && <MapList maps={mapList.maps}></MapList>}
      {mapList.maps && mapList.maps?.length > 0 && <DisplayMaps></DisplayMaps>}
    </Box>
  )
}

export default Maps;

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const httpClient = new SS_GetMapClient(context)
  const queryClient = new QueryClient();

  try {
    const map = await httpClient.getMapById()
    const mapList = await httpClient.getMapsByQ()
    await Promise.allSettled([
      await queryClient.prefetchQuery({
        queryKey: [Q_MAP, httpClient.getParam("catalogId")],
        queryFn: () => map
      }),
      await queryClient.prefetchQuery({
        queryKey: [Q_MAPS, httpClient.getQuery("device")],
        queryFn: () => mapList
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