export interface Data {
  openedAssetId: string;
}
export interface Methods {
  fetchAssets(vm: any): void;
  openPackML(assetId: string): void;
  buttonVariant(assetId: string): string;
  scrollCallback(): void;
}
export interface Computed {
  allAssets: any; //TODO
  assetsList: [];
  sortedAssetsList: [];
  loadedAssets: number;
  limitedAssetsList;
  hasLoaded: boolean;
}
export interface Props {}
