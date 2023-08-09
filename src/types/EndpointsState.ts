export default interface EndpointsState {
  MQTT_BROKER_URL: string | undefined;
  CAMUNDA_REST_URL: string | undefined;
  REGISTRY_URL: string | undefined;
  mockData: boolean;
}
