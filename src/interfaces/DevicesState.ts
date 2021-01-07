export interface Capability {
  id?: string;
  name: string;
  taught: boolean;
}

export interface Device {
  componentId: string;
  componentName: string;
  currentMode: string;
  currentState: string;
  serial: string;
  capabilityAssertionId: string;
  capability: Capability[];
  type: string;
  docuLink: string;
  location: string;
}

export interface DevicesState {
  devices: Device[];
}
