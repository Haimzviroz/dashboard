import { Map, MapLayersProps, Maps, ProductsRes, ShownType, StrPointsType, productMap } from "@/types/interfaces";
import { Feature, MultiPolygon, Point, Polygon, Position, bbox, bboxPolygon, center, combine, featureCollection, multiPolygon, polygon } from "@turf/turf";
import { LatLngExpression, LatLngLiteral, LatLngTuple } from "leaflet";
import { MapHelpers } from "./map-helpers";

export class MapLayers implements MapLayersProps {
  // center: Point = {} as Point;
  // fullBbox: LatLngLiteral[] | LatLngLiteral[][] = [];
  // footPrint: FootPrint | undefined;
  // maps: Maps[] | undefined;

  shownType: ShownType = "all";
  center: LatLngExpression | undefined;
  selectedMap: Map | undefined;
  mapsPoints: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][] | undefined
  products: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][] | undefined

  constructor(maps: Maps[] | undefined, selectedMap: Map | undefined, products: ProductsRes | undefined, type?: ShownType) {
    // this.maps = maps
    // this.selectedMap = selectedMap
    // this.footPrint = foodPrint

    // // Needs first to set to footprint
    // this.prepareFootPrint()
    // this.getAllPropsToPresent()


    if (selectedMap) {
      this.shownType = "single"
      this.center = this.setMaps([selectedMap])
      if (type == "drawing" && products && products.status == "Success") {
        this.setProducts(products?.products)
      } else {
        this.setProducts([selectedMap.product])
      }
    } else {
      this.shownType = "all"
      this.center = maps && this.setMaps(maps)
      products && products.status == "Success" && this.setProducts(products.products)
    }
  }

  setMaps(maps: Maps[]): LatLngTuple {
    const mapsCoordinates: LatLngTuple[][][] = []
    const mapsFeature: Feature<Polygon | MultiPolygon>[] = []
    maps.forEach(m => {
      const { coords, fPolygon } = MapLayers.getMapPolygon(m)
      fPolygon.geometry.type === "Polygon" ? mapsCoordinates.push(coords as LatLngTuple[][]) : coords.map(c => mapsCoordinates.push(c as LatLngTuple[][]))
      m.coords = coords
      mapsFeature.push(fPolygon)
      // this.mapsList.push(m)
    })
    const multiPolygon = featureCollection(mapsFeature)
    this.mapsPoints = mapsCoordinates
    return MapLayers.swapPoint(center(multiPolygon).geometry.coordinates)
  }

  static getMapPolygon(map: Maps) {
    let fPolygon: Feature<Polygon | MultiPolygon>;
    if (!map.footprint) {
      if (MapHelpers.isBBoxOrPolygon(map.boundingBox) === "bbox") {
        fPolygon = bboxPolygon(MapHelpers.bboxStringToBboxArray(map.boundingBox))
      } else {
        fPolygon = polygon([MapHelpers.stringToPolygon(map.boundingBox)])
      }
    } else {
      const [shapeType, numArr] = MapHelpers.isPolygonOrMultiPolygon(MapHelpers.pointsStringToArray(map.footprint))
      if (shapeType === "Polygon") {
        fPolygon = polygon(numArr as Position[][])
      } else {
        fPolygon = multiPolygon(numArr as Position[][][])
      }
    }
    const coords = MapLayers.coordinate2LatLngFormat(fPolygon.geometry.coordinates)
    return { coords, fPolygon }
  }


  setProducts(products: productMap[]) {
    const productsCoordinates: LatLngTuple[][][] = []
    products.forEach(p => {
      const fPolygon: Polygon | MultiPolygon = JSON.parse(p.footprint);
      if (fPolygon.type === "Polygon") {
        const coords = MapLayers.coordinate2LatLngFormat(fPolygon.coordinates)
        productsCoordinates.push(coords as LatLngTuple[][])
      } else {
        fPolygon.coordinates.forEach(poly => {
          const coords = MapLayers.coordinate2LatLngFormat(poly)
          productsCoordinates.push(coords as LatLngTuple[][])
        })
      }
    })
    this.products = productsCoordinates
  }

  // Util helpers
  static swapPoint(coordinate: [number, number, (number | undefined)?] | [number, number] | number[]): [number, number] {
    return [coordinate[1], coordinate[0]]
  }

  static coordinate2LatLngFormat(coordinate: number[][][] | number[][][][]): LatLngTuple[][] | LatLngTuple[][][] {
    const coordsMapping = (coordinates: [number, number][]): LatLngTuple[] => {
      return coordinates.map(c => MapLayers.swapPoint(c))
    }

    const coordsArrMapping = (
      coords: number[][] | number[][][] | number[][][][]
    ): LatLngTuple[][] | LatLngTuple[][][] => {
      if (typeof coords[0][0] === "number") {
        return coordsMapping(coords as [number, number][]) as unknown as LatLngTuple[][]
      } else {
        return (coords as number[][][]).map(innerCoords => coordsArrMapping(innerCoords)) as unknown as LatLngTuple[][]
      }
    }

    return coordsArrMapping(coordinate)
  }

  static latLngFormat2Coordinate(latLng: LatLngTuple[][] | LatLngTuple[][][]): number[][][] | number[][][][] {

    const reverseCoordsMapping = (latLngs: LatLngTuple[]): [number, number][] => {
      return latLngs.map(latLngPoint => MapLayers.swapPoint(latLngPoint) as [number, number]);
    };

    const reverseCoordsArrMapping = (
      latlngArr: LatLngTuple[][] | LatLngTuple[][][]
    ): number[][][] | number[][][][] => {
      if (typeof latlngArr[0][0][0] === "number") {
        return [reverseCoordsMapping(latlngArr[0] as LatLngTuple[])]
      }
      return (latlngArr as LatLngTuple[][][]).map(innerLatLng => reverseCoordsArrMapping(innerLatLng)) as number[][][][];
    }

    return reverseCoordsArrMapping(latLng);
  }

  static position2LatLngFormat(coordinate: Position): LatLngTuple {
    return [coordinate[1], coordinate[0]] as LatLngTuple
  }


  // pointStrToArr(bbox: string) {
  //   return bbox.split(",").map(point => Number(point))
  // }

  // fromPointsArrayToLatLng(pointArr: number[]): LatLngLiteral[] {
  //   const latLngArr = []
  //   if (pointArr.length % 2 === 0) {
  //     for (let i = 0; i < pointArr.length; i = i + 2) {
  //       latLngArr.push({
  //         lat: pointArr[i + 1],
  //         lng: pointArr[i]
  //       })
  //     }
  //   }
  //   return latLngArr
  // }

  // fromPointArrayToLatLng(pointArr: number[]): LatLngLiteral | undefined {
  //   if (pointArr.length == 2) {
  //     return {
  //       lat: pointArr[1],
  //       lng: pointArr[0]
  //     }
  //   }
  // }

  // fromNestedArrToLatLng(pointArr: number[] | number[][]): any {
  //   if (Array.isArray(pointArr[0])) {
  //     return pointArr.map(item => this.fromNestedArrToLatLng(item as number[]))
  //   }
  //   return this.fromPointArrayToLatLng(pointArr as number[])
  // }

  // getCenter(points: LatLngLiteral[]) {
  //   const lat = (points[0].lat + points[1].lat) / 2
  //   const lng = (points[0].lng + points[1].lng) / 2
  //   return { lat, lng }
  // }

  // getFullBbox(points: LatLngLiteral[]) {
  //   const fullBbox = []
  //   fullBbox.push(points[0])
  //   fullBbox.push({ lat: points[0].lat, lng: points[1].lng })
  //   fullBbox.push(points[1])
  //   fullBbox.push({ lat: points[1].lat, lng: points[0].lng })
  //   return fullBbox
  // }

  // prepareFullBbox(bbox: string) {
  //   const bboxArr = this.pointStrToArr(bbox);
  //   const latLngArr = this.fromPointsArrayToLatLng(bboxArr)
  //   const center = this.getCenter(latLngArr)
  //   const fullBbox = this.getFullBbox(latLngArr)
  //   return { fullBbox, center }
  // }

  // prepareFootPrint() {
  //   const _footPrint: FootPrint = {} as FootPrint;

  //   if (this.footPrint?.bbox) {
  //     _footPrint.bbox = this.fromPointsArrayToLatLng(this.footPrint.bbox as number[])
  //     _footPrint.bbox = this.getFullBbox(_footPrint.bbox as LatLngLiteral[])
  //   }
  //   if (this.footPrint?.coordinates) {
  //     _footPrint.coordinates = this.fromNestedArrToLatLng(this.footPrint.coordinates as unknown as number[])
  //   }
  //   this.footPrint = _footPrint
  //   return _footPrint
  // }

  // getAllPropsToPresent() {
  //   let fullBbox;
  //   let center;
  //   if (this.selectedMap && !Array.isArray(this.selectedMap)) {
  //     const preparedFullBbox = this.prepareFullBbox(this.selectedMap.boundingBox)
  //     fullBbox = preparedFullBbox.fullBbox
  //     center = preparedFullBbox.center
  //     // this.prepareFootPrint()
  //   } else if (this.maps?.map) {
  //     let minLat = Number.MAX_VALUE
  //     let maxLat = Number.MIN_VALUE
  //     let minLng = Number.MAX_VALUE
  //     let maxLng = Number.MIN_VALUE
  //     fullBbox = this.maps.map(map => {
  //       let props = this.prepareFullBbox(map.boundingBox)
  //       minLat = Math.min(minLat, props.center.lat)
  //       maxLat = Math.max(maxLat, props.center.lat)
  //       minLng = Math.min(minLng, props.center.lng)
  //       maxLng = Math.max(maxLng, props.center.lng)
  //       return props.fullBbox
  //     }
  //     )
  //     center = this.getCenter([{ lat: minLat, lng: minLng }, { lat: maxLat, lng: maxLng }])
  //     // this.prepareFootPrint()
  //   } else {
  //     fullBbox = [] as LatLngLiteral[]
  //     center = this.getCenter(this.footPrint?.bbox as LatLngLiteral[] ?? [this.footPrint?.coordinates[0][0], this.footPrint?.coordinates[0][1]])
  //   }

  //   this.fullBbox = fullBbox
  //   this.center = center
  // }
}