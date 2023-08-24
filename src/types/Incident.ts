export default interface Incident {
  id: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  rootProcessInstanceId: string;
  createTime: string;
  endTime: string | null;
  removalTime: string | null;
  incidentType: string;
  activityId: string;
  failedActivityId: string | null;
  causeIncidentId: string;
  rootCauseIncidentId: string;
  configuration: string;
  historyConfiguration: string;
  incidentMessage: string;
  tenantId: string | null;
  jobDefinitionId: string | null;
  open: boolean;
  deleted: bolean;
  resolved: boolean;
  annotation: string | null;
}
