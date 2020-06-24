import { Device } from "@/interfaces/DevicesState"

interface options {
    text: "PRODUCTION" | "CHANGEOVER" | "SIMULATION",
    value: "PRODUCTION" | "CHANGEOVER" | "SIMULATION",
    disabled: boolean
}

export interface Data {
    graph: any, //since there is no mxgraph typescript support
    oldBorderColor: string,
    currentCell: object,
    xmlLoaded: boolean,
    selected: "PRODUCTION" | "CHANGEOVER" | "SIMULATION",
    options: options[]
}

export interface Methods {
    initGraph(): void,
    markCurrentState(state: string): void,
    clear(): void,
    stopButton(): void,
    resetButton(): void,
    modeButton(value: string): void
}

export interface Computed {
    allDevices(val: Device[]): Device[]
}

export interface Props {
    openedDeviceIndex: number
}