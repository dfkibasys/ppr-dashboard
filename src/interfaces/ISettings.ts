interface languages {
  value: string;
  text: string;
}
export interface Data {
  langs: languages[];
}
export interface Methods {
  fetchAssets(vm: any): void;
  changeMQTTdata(): void;
  changeREGISTRYdata(): void;
}
export interface Computed {
  registryUrl: string;
  mqttUrl: string;
  camundaUrl: string;
  mockDataEnabled: boolean;
}
export interface Props {}
