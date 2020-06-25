import VueI18n from "vue-i18n";

interface breadcrumbItem {
    text: VueI18n.TranslateResult,
    to: string
}

export interface Data {
    bcItems: breadcrumbItem[],
    updateInterval: number,
    intervalRef: number,
    overlaysArr: any, //since there is no BpmnJS typescript support
    processInstance: any, //since there is no Camunda typescript support
    processDefinition: any, //since there is no Camunda typescript support
    processDefinitionXML: string,
    showLeftDetails: boolean,
    auditLog: any, //since there is no Camunda typescript support
    auditFields: string[],
    variables: any, //since there is no Camunda typescript support
    variablesFields: string[],
    incidents: any, //since there is no Camunda typescript support
    incidentsFields: string[]
}
export interface Methods {
    handleError(err: any): void,
    handleShown(): void,
    fetchLeftDetails(piid: string, pdid: string): Promise<any>,
    fetchBPMN(id: string): Promise<any>,
    updateDiagram(): void,
    fetchTabContent(): Promise<any>
}
export interface Computed {
    camundaUrl: string,
    baseUrl: string | undefined
}
export interface Props {}