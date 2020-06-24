interface languages {
    value: string,
    text: string
}
export interface Data {
    langs: languages[]
}
export interface Methods {
    fetchDevices(vm: any): void,
    changeMQTTdata(): void,
    changeBASYSdata(): void
}
export interface Computed {
    basysUrl: string,
    mqttUrl: string,
    camundaUrl: string,
    mockDataEnabled: boolean
}
export interface Props {}