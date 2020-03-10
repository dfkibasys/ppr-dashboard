const state = {
    BASYS_REST_URL: process.env.VUE_APP_BASYS_REST_URL,
    MQTT_BROKER_URL: process.env.VUE_APP_MQTT_BROKER_URL,
    CAMUNDA_REST_URL: process.env.VUE_APP_CAMUNDA_REST_URL
};
const getters = {
    basysUrl: (state) => state.BASYS_REST_URL,
    mqttUrl: (state) => state.MQTT_BROKER_URL,
    camundaUrl: (state) => state.CAMUNDA_REST_URL
};
const mutations = {
    setBasysUrl: (state, url) => (state.BASYS_REST_URL = url),
    setMqttUrl: (state, url) => (state.MQTT_BROKER_URL = url),
    setCamundaUrl: (state, url) => (state.CAMUNDA_REST_URL = url)
};
const actions = {};

export default {
    state,
    getters,
    mutations,
    actions
}