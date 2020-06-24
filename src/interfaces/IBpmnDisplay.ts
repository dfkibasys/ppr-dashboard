export interface Data {
    diagramXML: string,
    elementOverlays: any[],
    bpmnViewer: any //since there is no BpmnJS typescript support
}
export interface Methods {
    fetchDiagram(url: string): void,
    getOverlays(): any, //since there is no BpmnJS typescript support
    addBaSysLogo(element: any): void
}
export interface Computed {}
export interface Props {
    url: string,
    xml: string
}