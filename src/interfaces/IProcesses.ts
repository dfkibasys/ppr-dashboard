import VueI18n from 'vue-i18n';

interface breadcrumbItem {
  text: VueI18n.TranslateResult;
  to: string;
}

export interface Data {
  bcItems: breadcrumbItem[];
  processDefinitionsCount: number;
  decisionDefinitionsCount: number;
  caseDefinitionsCount: number;
  deploymentsCount: number;
  processDefinitions: any; //since there is no Camunda typescript support
  fields: string[];
}
export interface Methods {
  goToProcessView(item: any): void;
}
export interface Computed {}
export interface Props {}
