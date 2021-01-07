type Callback = () => void;

export interface Data {
  managements: object[];
}
export interface Methods {
  loadInitialData(mockData: boolean, callback?: Callback): void;
}
export interface Computed {
  basysUrl: string;
  mockDataEnabled: boolean;
}
export interface Props {}
