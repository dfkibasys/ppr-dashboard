export interface Data {
  openedIndex: number;
  openedAssetId: string;
}
export interface Methods {
  fetchDevices(vm: any): void;
  fetchAssets(vm: any): void;
  openPackML(idShort: string): void;
  openCapabilityOverview(index: number): void;
}
export interface Computed {
  allAssets: any; //TODO
  assetsList: [];
  sortedAssetsList: [];
}
export interface Props {}
