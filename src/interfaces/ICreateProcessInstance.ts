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
