interface languages {
  value: string;
  text: string;
}
export interface Data {
  langs: languages[];
}
export interface Methods {
  fetchDevices(vm: any): void;
  fetchAssets(vm: any): void;
  changeMQTTdata(): void;
  changeBASYSdata(): void;
  changeREGISTRYdata(): void;
  signout(): void;
}
export interface Computed {
  registryUrl: string;
  basysUrl: string;
  mqttUrl: string;
  camundaUrl: string;
  mockDataEnabled: boolean;
  user: string;
  authorized: boolean;
}
export interface Props {}
