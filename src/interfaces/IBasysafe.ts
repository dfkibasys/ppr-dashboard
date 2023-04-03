type Callback = () => void;

export interface Data { 
  config: {
    press: {
      maxCounter: number,
      freqHz: number
    }
  }
  states: {
    estopbutton: boolean,
    initiator: boolean,
    safetylightcurtain: boolean,
    signalcolumn: {
      red: boolean,
      yellow: boolean,
      green: boolean,
      white: boolean
    },
    press: {
      counter: number,
      opmode: string,
      state: string
    }
  },
  topics: {
    statusSafetyLightCurtain: string,
    statusSignalColumn: string,
    statusInitiator: string
    statusEstopButton: string,
    statusAckButton: string,
    statusPress: string,
    commandSignalColumn: string
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
