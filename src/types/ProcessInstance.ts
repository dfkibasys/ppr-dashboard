export default interface ProcessInstance {
  id: string;
  businessKey: string | null;
  processDefinitionId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  processDefinitionVersion: number;
  startTime: string;
  endTime: string | null;
  removalTime: string | null;
  durationInMillis: number | null;
  startUserId: string | null;
  startActivityId: string;
  deleteReason: string | null;
  rootProcessInstanceId: string;
  superProcessInstanceId: string | null;
  superCaseInstanceId: string | null;
  caseInstanceId: string | null;
  tenantId: string | null;
  state: string;
}
