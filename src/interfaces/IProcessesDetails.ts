import VueI18n from "vue-i18n";

interface breadcrumbItem {
    text: VueI18n.TranslateResult,
    to: string
}

export interface Data {
    bcItems: breadcrumbItem[],
    updateInterval: number,
    intervalRef: number,
    instanceFields: string[],
    auditFields: string[],
    showLeftDetails: boolean,
    currentVersionID: string,
    versions: any,
    processInstances: any, //since there is no Camunda typescript support
    processDefinition: any, //since there is no Camunda typescript support
    processDefinitionXML: string,
    auditLog: any, //since there is no Camunda typescript support
    overlaysArr: any //since there is no BpmnJS typescript support
}
export interface Methods {
  goToProcessInstance(item: any): void,
  handleError(err: any): void,
  handleShown(): void,
  versionChange(): void,
  deleteDeployment(): void,
  fetchAllData(): void,
  fetchLeftDetails(id: string): Promise<any>,
  fetchBPMN(id: string): Promise<any>,
  fetchTabContent(id: string): Promise<any>,
  updateDiagram(): void,
  createProcessInstance(): void,
  deleteProcessInstance(id: string): void
}
export interface Computed {
    camundaUrl: string,
    baseUrl: string | undefined
}
export interface Props {}