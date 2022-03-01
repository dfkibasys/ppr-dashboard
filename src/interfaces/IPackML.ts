import { Asset } from './AssetsState';

interface options {
  text: 'AUTOMATIC' | 'SEMI-AUTOMATIC' | 'SIMULATE';
  value: 'AUTO' | 'SEMIAUTO' | 'SIMULATE';
  disabled: boolean;
}

export interface Data {
  graph: any; //since there is no mxgraph typescript support
  oldBorderColor: string;
  currentCell: object;
  xmlLoaded: boolean;
  selected: 'AUTO' | 'SEMIAUTO' | 'SIMULATE';
  options: options[];
}

export interface Methods {
  initGraph(): void;
  markCurrentState(state: string): void;
  clear(): void;
  setModeButton(): void;
  stopButton(): void;
  resetButton(): void;
  modeButton(value: string): void;
  freeButton(): void;
  occupyButton(): void;
  prioButton(): void;
}

export interface Computed {
  asset: Asset; //TODO
  currentUser: string;
  isAuthorized: boolean;
}

export interface Props {
  openedAssetId: string;
}
