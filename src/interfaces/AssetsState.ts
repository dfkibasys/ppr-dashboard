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
    [idShort: string]: {
      IdentificationSubmodelEndpoint: string;
      ControlComponentInterfaceSubmodelEndpoint?: string;
      ControlComponentConfigurationSubmodelEndpoint?: string;
    };
  };
  assetsList: [];
}
