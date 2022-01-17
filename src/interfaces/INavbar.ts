export interface Data {}
export interface Methods {
  signout(): void;
  openSettings(): void;
}
export interface Computed {
  user: string;
  authorized: boolean;
  fixedHeader: boolean;
}
export interface Props {}
