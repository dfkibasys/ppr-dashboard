import {Module, ActionTree, MutationTree, GetterTree} from 'vuex';
import EndpointsState from '@/interfaces/EndpointsState'
import { RootState } from '@/interfaces/RootState';

const state: EndpointsState = {
    BASYS_REST_URL: process.env.VUE_APP_BASYS_REST_URL,
    MQTT_BROKER_URL: process.env.VUE_APP_MQTT_BROKER_URL,
    CAMUNDA_REST_URL: process.env.VUE_APP_CAMUNDA_REST_URL,
    REGISTRY_URL: process.env.VUE_APP_AAS_REGISTRY_URL,
    mockData: false
};
const getters: GetterTree<EndpointsState, RootState> = {
    basysUrl: (state) => state.BASYS_REST_URL,
    mqttUrl: (state) => state.MQTT_BROKER_URL,
    camundaUrl: (state) => state.CAMUNDA_REST_URL,
    registryUrl: (state) => state.REGISTRY_URL,
    mockDataEnabled: (state) => state.mockData
};
const mutations: MutationTree<EndpointsState> = {
    setBasysUrl: (state, url: string) => (state.BASYS_REST_URL = url),
    setMqttUrl: (state, url: string) => (state.MQTT_BROKER_URL = url),
    setCamundaUrl: (state, url: string) => (state.CAMUNDA_REST_URL = url),
    setRegistryUrl: (state, url: string) => (state.REGISTRY_URL = url),
    switchMockDataState: (state, value: boolean) => (state.mockData = value)
};
const actions: ActionTree<EndpointsState, RootState> = {};

export const endpoints: Module<EndpointsState, RootState> = {
    state,
    getters,
    mutations,
    actions
}