import { LatLngExpression } from "leaflet";
import { Map } from '@/types/interfaces';

export type ShownType = "single" | "all" | "drawing"

export interface MapLayersProps {
  center: LatLngExpression | undefined
  shownType: ShownType
  selectedMap: Map | undefined;
  mapsPoints: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][] | undefined
  products: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][] | undefined
}

// export interface Point {
//   lat: number;
//   lng: number;
// }

// export interface FootPrint {
//   bbox: number[] | LatLngLiteral[];
//   type: string;
//   coordinates: Array<Array<number[]>> | Array<Array<LatLngLiteral[]>>;
// }

export type MapPurpose = "nav" | "draw"

export interface MapDrawForm {
  id?: string,
  productId?: string,
  productName?: string,
  name?: string,
  resolution?: number
}

export enum DrawMapStatus {
  start,
  created,
  edited,
  finished,
  error
}