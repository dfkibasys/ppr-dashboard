export interface Data {
  user: string;
  password: string;
  userState: boolean | null;
  passwordState: boolean | null;
}
export interface Methods {
  login(): void;
}
export interface Computed {
  hash(password: string): string;
  verify(password: string, hash: string): boolean;
}
export interface Props {}
