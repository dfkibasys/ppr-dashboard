export interface Data {
  openedAssetId: string;
}
export interface Methods {
  fetchAssets(vm: any): void;
  openPackML(assetId: string): void;
  buttonVariant(assetId: string): string;
  scrollCallback(): void;
  loadMore(): void;
}
export interface Computed {
  allAssets: any; //TODO
  assetsList: [];
  sortedAssetsList: [];
  loadedAssets: number;
  limitedAssetsList;
  hasLoaded: boolean;
  hasMoreAssets: boolean;
}
export interface Props {}
