import EndpointsState from '@/types/EndpointsState';
import getEnv from '@/helpers/env';

const state: EndpointsState = {
  MQTT_BROKER_URL: getEnv('VITE_MQTT_BROKER_URL'),
  CAMUNDA_REST_URL: getEnv('VITE_CAMUNDA_REST_URL'),
  REGISTRY_URL: getEnv('VITE_AAS_REGISTRY_URL'),
  mockData: false,
};
const getters = {
  /**
   * Get current MQTT broker url
   * @param state
   * @returns {String}
   */
  mqttUrl: (state) => state.MQTT_BROKER_URL,

  /**
   * Get current Camunda instance url
   * @param state
   * @returns {String}
   */
  camundaUrl: (state) => state.CAMUNDA_REST_URL,

  /**
   * Get current registry url
   * @param state
   * @returns {String}
   */
  registryUrl: (state) => state.REGISTRY_URL,

  /**
   * Get whether mock data or data from a live instance will be loaded
   * @param state
   * @returns {Boolean}
   */
  mockDataEnabled: (state) => state.mockData,
};
const mutations = {
  /**
   * commit MQTT broker to state
   *
   * @param state
   * @param url
   * @returns
   */
  setMqttUrl: (state, url: string) => (state.MQTT_BROKER_URL = url),

  /**
   * commit Camunda url to state
   *
   * @param state
   * @param url
   * @returns
   */
  setCamundaUrl: (state, url: string) => (state.CAMUNDA_REST_URL = url),

  /**
   * commit registry url to state
   *
   * @param state
   * @param url
   * @returns
   */
  setRegistryUrl: (state, url: string) => (state.REGISTRY_URL = url),

  /**
   * commit mock data state to state
   * @param state
   * @param value
   * @returns
   */
  switchMockDataState: (state, value: boolean) => (state.mockData = value),
};

const actions = {};

export const endpoints = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
