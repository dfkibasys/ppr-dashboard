import { Capability, Device } from "@/interfaces/DevicesState"

export interface Data {

}
export interface Methods {
    removeCapability(capability: Capability): void,
    startTeaching(): void
}
export interface Computed {
    basysUrl: string,
    camundaUrl: string,
    allDevices: Device[]
}
export interface Props {
    openedDeviceIndex: number
}