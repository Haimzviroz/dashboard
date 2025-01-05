import { StrPointsType } from "@/types/interfaces";
import { Feature, MultiPolygon, Polygon, area, bbox, bboxPolygon, booleanWithin, intersect, multiPolygon, point, polygon } from "@turf/turf";

export class MapHelpers {

  static pointsStringToArray(points: string): number[] {
    return points.split(",").map(val => Number(val.trim())).filter(val => !isNaN(val));
  }

  static isBBoxOrPolygon(bBox: string): StrPointsType {
    const points: number[] = MapHelpers.pointsStringToArray(bBox)
    if (points) {
      if (points.length === 4) return "bbox"
      if (points.length % 2 === 0 && point.length >= 8) return "polygon"
      else return "invalid"
    }
    return "invalid"
  }



  // BBox validator
  static isBBoxAreaValid(bBox: number[]): boolean {
    const bboxArea = Math.abs(bBox[2] - bBox[0]) * Math.abs(bBox[3] - bBox[1]);
    const maxArea = Number(process.env.MAX_BBOX_AREA_4_EXPORT) ?? 0.01
    return bboxArea < 0 || bboxArea <= maxArea
  }

  static isValidStringForBBox(bBox: string): boolean {
    const bBoxValues: number[] = MapHelpers.pointsStringToArray(bBox)
    return bBoxValues !== null && bBoxValues.length === 4
  }

  static bboxStringToBboxArray(bBox: string): [number, number, number, number] {
    const bbox = MapHelpers.pointsStringToArray(bBox)
    return [
      Math.min(bbox[0], bbox[2]),
      Math.min(bbox[1], bbox[3]),
      Math.max(bbox[0], bbox[2]),
      Math.max(bbox[1], bbox[3])
    ]
  }

  static bBoxToPolygon(bbox: [number, number, number, number]) {
    return bboxPolygon(bbox)
  }

  static isBBoxInFootprint(bBox: Feature, footprint: Feature): boolean {
    return booleanWithin(bBox, footprint)
  }

  static isBBoxIntersectFootprint(bBox: Feature<Polygon>, footprint: Feature<Polygon | MultiPolygon>): Feature<Polygon | MultiPolygon> | null {
    return intersect(bBox, footprint)
  }

  static getIntersectPercentage(poly: Feature<Polygon>, availablePoly: Feature<Polygon | MultiPolygon>) {
    let polyArea = area(poly)
    let availPolyArea = area(availablePoly)

    return availPolyArea / polyArea * 100
  }

  // Polygon validators 
  static stringToPolygon(pointsString: string): number[][] {
    const points: number[] = MapHelpers.pointsStringToArray(pointsString)
    const polygon: number[][] = []
    if (points !== null && points.length % 2 === 0) {
      for (let i = 0; i < points.length; i = i + 2) {
        const point = []
        point.push(points[i])
        point.push(points[i + 1])
        polygon.push(point)
      }
    }
    return polygon
  }

  static isPolygonOrMultiPolygon(numArr: number[]): ["Polygon" | "MultiPolygon", [number, number][][] | [number, number][][][]] | [null, null] {
    if (numArr.length < 8 || numArr.length % 2 !== 0) {
      return [null, null];
    }

    const isClosed = (x1: number, y1: number, x2: number, y2: number) => {
      return x1 === x2 && y1 === y2;
    };

    const points: [number, number][] = [];
    for (let i = 0; i < numArr.length; i += 2) {
      points.push([numArr[i], numArr[i + 1]]);
    }

    let currentRingStart = 0;
    const rings: [number, number][][] = [];
    const polygons: [number, number][][][] = [];

    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[currentRingStart];
      const [x2, y2] = points[i];

      if (isClosed(x1, y1, x2, y2)) {
        const ring = points.slice(currentRingStart, i + 1);
        rings.push(ring);
        currentRingStart = i + 1
        i++
      }
    }
    if (rings.length === 1) {
      return ["Polygon", rings];
    } else if (rings.length > 1) {
      rings.map(r => polygons.push([r]));
      return ["MultiPolygon", polygons];
    }

    // if (ringCount === 1) {
    //   return ['Polygon', points];
    // } else if (ringCount > 1) {
    //   return ['MultiPolygon', points];
    // }

    return [null, null];
  }

  static isValidPolygon(polygon: number[][]) {
    return polygon != null &&
      polygon.length >= 4 &&
      polygon[0][0] === polygon[polygon.length - 1][0] &&
      polygon[0][1] === polygon[polygon.length - 1][1]
  }

  static isValidStringForPolygon(polyStr: string): false | number[][] {
    const polygon = MapHelpers.stringToPolygon(polyStr)
    return MapHelpers.isValidPolygon(polygon) ? polygon : false
  }

  static isPolygonAreaValid(poly: Feature, maxSize?: number): boolean {
    const polyArea = area(poly) / 1000000
    const maxArea = maxSize ?? 100
    return polyArea < 0 || polyArea <= maxArea
  }

}