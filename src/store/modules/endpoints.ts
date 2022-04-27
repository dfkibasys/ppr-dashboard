import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import EndpointsState from '@/interfaces/EndpointsState';
import { RootState } from '@/interfaces/RootState';
import getEnv from '@/helpers/env';

const state: EndpointsState = {
  MQTT_BROKER_URL: getEnv('VUE_APP_MQTT_BROKER_URL'),
  CAMUNDA_REST_URL: getEnv('VUE_APP_CAMUNDA_REST_URL'),
  REGISTRY_URL: getEnv('VUE_APP_AAS_REGISTRY_URL'),
  mockData: false,
};
const getters: GetterTree<EndpointsState, RootState> = {
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
const mutations: MutationTree<EndpointsState> = {
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

const actions: ActionTree<EndpointsState, RootState> = {};

export const endpoints: Module<EndpointsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
