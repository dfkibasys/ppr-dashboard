export default interface ProcessDefinition {
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
