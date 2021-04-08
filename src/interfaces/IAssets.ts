export interface Data {
  openedAssetId: string;
}
export interface Methods {
  fetchAssets(vm: any): void;
  openPackML(assetId: string): void;
  buttonVariant(assetId: string): string;
}
export interface Computed {
  allAssets: any; //TODO
  assetsList: [];
  sortedAssetsList: [];
}
export interface Props {}
