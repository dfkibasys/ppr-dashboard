export interface IDSubmodel {
  Documentation?: string;
  ManufacturerName?: string;
  ManufacturerProductDesignation?: string;
  SerialNumber?: string;
  TypThumbnail?: string;
}

export interface CCISubmodel {
  ERRMSG?: string;
  EXST?: string;
  EXMODE?: string;
  ERRCODE?: number;
  OPMODE?: string;
  OCCST?: string;
  WORKST?: string;
}

export interface AssetsState {
  assets: {
    [assetId: string]: {
      IdentificationSubmodelEndpoint: string;
      CapabilitiesSubmodelEndpoint?: string;
      CCInterfaceSubmodelEndpoint?: string;
      CCInstanceSubmodelEndpoint?: string;
      ERRMSG?: string;
      EXST?: string;
      EXMODE?: string;
      ERRCODE?: number;
      OPMODE?: string;
      OCCST?: string;
      WORKST?: string;
    };
  };
  assetsList: [];
}
