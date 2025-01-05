export interface Platforms {
  [key: string] : Platform 
}

export interface Platform {
  name: string;
  formations : Formations
}

export interface Formations {
  [key: string] : Release[]
}

// export interface Release {
//   id: number;
//   createdDate: Date;
//   lastUpdatedDate: Date;
//   platform: string;
//   component: string;
//   formation: string;
//   deploymentStatus?: any;
//   securityStatus?: any;
//   policyStatus?: any;
//   url: string;
//   OS: string
//   version: string
//   metadata: Metadata
//   s3Url: any
// }

export interface Release {
  // id: number;
  // createdDate: Date;
  // lastUpdatedDate: Date;
  // component: string;
  // url: string;
  // OS: string
  // metadata: Metadata
  // s3Url: any
  catalogId: number;
  name: string;
  releaseNotes: string;
  virtualSize: number;
  category: string;
  uploadStatus: string;

  platform: string;
  formation: string;
  version: string
  deploymentStatus?: any;
  securityStatus?: any;
  policyStatus?: any;

}

export interface Metadata {
  url: string
  artifactType: string
}






