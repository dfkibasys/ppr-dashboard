const state = {
    BASYS_REST_URL: "http://10.2.10.3:8080",
    MQTT_BROKER_URL: "ws://10.2.10.1:8083/mqtt",
    CAMUNDA_REST_URL: "http://10.2.10.4:8080"
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