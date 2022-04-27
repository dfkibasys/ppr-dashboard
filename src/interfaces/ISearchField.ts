export interface Data {
  timeout: ReturnType<typeof setTimeout> | null;
}
export interface Methods {
  handleInputEvent($event: any): void;
}
export interface Computed {}
export interface Props {
  value: string;
  delayInput: number;
}
