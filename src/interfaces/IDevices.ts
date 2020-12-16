export interface Data {
    openedIndex: number,
    openedIdShort: string,
}
export interface Methods {
    fetchDevices(vm: any): void,
    fetchAssets(): void,
    openPackML(idShort: string): void,
    openCapabilityOverview(index: number): void
}
export interface Computed {}
export interface Props {}