export enum VarType {
  Placeholder = 'Type',
  Boolean = 'Boolean',
  String = 'String',
  Long = 'Long',
}

export interface ProcessVariable {
  id: number;
  name: string;
  type: VarType;
  value: string;
}

export interface Data {
  modalId: string;
  businessKey: string;
  processVariables: ProcessVariable[];
  processVariableID: number;
  typeOptions: VarType[];
  boolOptions: string[];
}
export interface Methods {
  addVariable(): void;
  deleteVariable(id: number): void;
  createInstance(): void;
  checkFormVariables(): void;
}
export interface Computed {
  VarType: typeof VarType;
  keyState: boolean;
}
export interface Props {}
