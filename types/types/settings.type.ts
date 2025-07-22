// types/settings.type.ts

// ----------------------------------
// בסיס משותף לכל הקונפיגורציות
// ----------------------------------
export interface BaseConfig {
  group: 'windows' | 'android';
  lastConfigUpdateDate: string;
  deliveryTimeoutMins: number;
  downloadRetryTime: number;
  downloadTimeoutMins: number;
  MaxMapAreaSqKm: number;
  maxMapSizeInMB: number;
  maxParallelDownloads: number;
  minAvailableSpaceMB: number;
  periodicInventoryIntervalMins: number;
  periodicConfIntervalMins: number;
  periodicMatomoIntervalMins: number;
  mapMinInclusionInPercentages: number;
  lastCheckingMapUpdatesDate: string;
  matomoUrl: string | null;
  matomoDimensionId: string;
  matomoSiteId: string;
}

// ----------------------------------
// טייפ עבור Windows
// ----------------------------------
export interface LayerConfig {
  layerName: string;
}

export interface WindowsConfig extends BaseConfig {
  group: 'windows';
  layers: LayerConfig[];
  getAppServerUrls: string[];
  queryStatusIntervalSec: number | null;
  networkStatusIntervalMins: number;
  technicianPassword?: string;
  tcpStreamTimeoutSec: number | null;
}

// ----------------------------------
// טייפ עבור Android
// ----------------------------------
export type StoragePolicy = 'SDOnly' | 'FlashOnly' | 'Both';

export interface AndroidConfig extends BaseConfig {
  group: 'android';
  targetStoragePolicy: StoragePolicy;
  sdStoragePath: string;
  flashStoragePath: string;
  ortophotoMapPath: string;
  controlMapPath: string;
  sdInventoryMaxSizeMB: number;
  flashInventoryMaxSizeMB: number;
}

// ----------------------------------
// יוניון לשימוש גלובלי
// ----------------------------------
export type DeviceConfig = WindowsConfig | AndroidConfig;
