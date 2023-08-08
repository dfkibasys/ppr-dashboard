export default interface Variable {
  type: string;
  value: string;
  valueInfo: object;
  id: string;
  name: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  activityInstanceId: string;
  caseDefinitionKey: string | null;
  caseDefinitionId: string | null;
  caseInstanceId: string | null;
  caseExecutionId: string | null;
  taskId: string | null;
  errorMessage: string | null;
  tenantId: string | null;
  state: string;
  createTime: string;
  removalTime: string | null;
  rootProcessInstanceId: string;
}
