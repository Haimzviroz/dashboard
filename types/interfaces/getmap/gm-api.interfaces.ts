export interface MapProperties {
  name?: string
  productName?: string,
  productId?: string,
  zoomLevel?: number,
  boundingBox: string,
  targetResolution?: number,
  lastUpdateAfter?: number
}

export interface ImportCreate {
  deviceId: string,
  mapProperties: MapProperties
}

export class CreateMap implements ImportCreate {
  deviceId: string
  mapProperties: MapProperties
  constructor(bbox: string, name?: string) {
    this.deviceId = "dashboard"
    this.mapProperties = {
      name,
      boundingBox: bbox,
    }
  }
}