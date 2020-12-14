
export interface IDSubmodel {
    Documentation?: string,
    ManufacturerName?: string,
    ManufacturerProductDesignation?: string,
    SerialNumber?: string,
    TypThumbnail?: string,
}
export interface AssetsState {
    assets: {
        [idShort: string]: {
            idSubmodelEndpoint: string,
        }
    },
    assetsList: [],
}