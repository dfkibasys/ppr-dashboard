export interface Data {
    openedIndex: number,
    openedIdShort: string,
    allAssets?: any, //TODO
    assetsList?: any //TODO
}
export interface Methods {
    fetchDevices(vm: any): void,
    fetchAssets(): void,
    openPackML(idShort: string): void,
    openCapabilityOverview(index: number): void
}
export interface Computed {}
export interface Props {}