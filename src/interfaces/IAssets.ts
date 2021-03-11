export interface Data {
  openedIndex: number;
  openedAssetId: string;
}
export interface Methods {
  fetchAssets(vm: any): void;
  openPackML(assetId: string): void;
}
export interface Computed {
  allAssets: any; //TODO
  assetsList: [];
  sortedAssetsList: [];
}
export interface Props {}
