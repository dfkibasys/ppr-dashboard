import VueI18n from 'vue-i18n';

export interface breadcrumbItem {
  text: VueI18n.TranslateResult;
  to: string;
  active: boolean;
}

export interface processDefinition {
  id: string;
  key: string;
  category: string;
  description: string | null;
  version: number;
  resource: string;
  deploymentId: string;
  diagram: string | null;
  suspended: boolean;
  versionTag: string | null;
  historyTimeToLive: string | null;
  startableInTasklist: boolean;
  instances: number;
  name: string;
  tenantId: string;
}

export interface processInstance {
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

export interface auditLog {
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

export interface variable {
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

export interface incident {
  // TODO: Compare to actual API
  id: string;
  name: string;
  message: string;
  startTime: string;
  activityName: string;
}
