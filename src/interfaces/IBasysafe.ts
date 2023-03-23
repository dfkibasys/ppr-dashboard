type Callback = () => void;

export interface Data { 
  config: {
    press: {
      maxCounter: number,
      freqHz: number
    }
  }
  states: {
    estopbutton: number,
    initiator: number,
    safetylightcurtain: number,
    signalcolumn: {
      red: number,
      yellow: number,
      green: number,
      white: number
    },
    press: {
      counter: number,
      opmode: string,
      state: string
    }
  },
  topics: {
    safetylightcurtain: string,
    signalcolumn: string,
    initiator: string
    estopbutton: string,
    ackbutton: string,
    press: string
  }
}
export interface Methods {
  ackButton(): void;
  setEstopButtonState(state:number): void;
  setSafetyLightCurtainState(state:number): void;
  setInitiatorState(state:number): void;
  setSignalColumnState(): void;  
  simulatePress(): void;  
  simulateRetract(): void;  
}
export interface Computed {}
export interface Props {}
