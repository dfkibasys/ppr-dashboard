export default interface AuditLog {
  id: string;
  parentActivityInstanceId: string;
  activityId: string;
  activityName: string;
  activityType: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  taskId: string | null;
  calledProcessInstanceId: string | null;
  calledCaseInstanceId: string | null;
  assignee: string | null;
  startTime: string;
  endTime: string;
  durationInMillis: number;
  canceled: boolean;
  completeScope: boolean;
  tenantId: string | null;
  removalTime: string | null;
  rootProcessInstanceId: string;
  referenceTime?: string | null; // TODO: Check if still available
}
