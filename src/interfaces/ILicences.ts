export interface Licence {
  name: string;
  version: string;
  repository: string;
  summary: string;
  'from package.json': string;
  'from license': string;
  'from readme': string;
}
