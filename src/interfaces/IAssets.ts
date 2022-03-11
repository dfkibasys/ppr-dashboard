export interface Data {
  openedAssetId: string;
  activeSort: number;
  containerId: string;
  sortOptions: Array<any>;
  search: string;
}
export interface Methods {
  fetchAssets(vm: any): void;
  openPackML(assetId: string): void;
  buttonVariant(assetId: string): string;
  scrollCallback(): void;
  loadMore(): void;
  loadAssets(purge?: Boolean): void;
  setOrder(option: any): void;
}
export interface Computed {
  assetsList: any; //TODO
  hasLoaded: boolean;
  hasMoreAssets: boolean;
}
export interface Props {}
