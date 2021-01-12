interface options {
  text: 'AUTOMATIC' | 'SEMI-AUTOMATIC' | 'SIMULATE';
  value: 'AUTO' | 'SEMIAUTO' | 'SIMULATION';
  disabled: boolean;
}

export interface Data {
  graph: any; //since there is no mxgraph typescript support
  oldBorderColor: string;
  currentCell: object;
  xmlLoaded: boolean;
  selected: 'AUTO' | 'SEMIAUTO' | 'SIMULATION';
  options: options[];
}

export interface Methods {
  initGraph(): void;
  markCurrentState(state: string): void;
  clear(): void;
  setModeButton(allAssets: object): void;
  stopButton(): void;
  resetButton(): void;
  modeButton(value: string): void;
  freeButton(): void;
  occupyButton(): void;
  prioButton(): void;
}

export interface Computed {
  allAssets(val: any): any; //TODO
  currentUser: string;
  isAuthorized: boolean;
}

export interface Props {
  openedIdShort: string;
}
