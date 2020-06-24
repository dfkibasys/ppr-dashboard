import VueI18n from "vue-i18n";

interface breadcrumbItem {
    text: VueI18n.TranslateResult,
    to: string
}

type Callback = () => void;

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
    incidentsFields: string[],
    cbCount: number
}
export interface Methods {
    handleError(err: any): void,
    handleShown(): void,
    fetchLeftDetails(piid: string, pdid: string, callback: Callback): void,
    fetchBPMN(id: string, callback: Callback): void,
    updateDiagram(): void,
    fetchTabContent(callback: Callback): void
}
export interface Computed {
    camundaUrl: string,
    baseUrl: string | undefined
}
export interface Props {}