type Callback = () => void;

export interface Data {
  services: object[];
}
export interface Methods {
  loadInitialData(mockData: boolean, callback?: Callback): void;
}
export interface Computed {
  mockDataEnabled: boolean;
}
export interface Props {}
