import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        BASYS_REST_URL: "http://127.0.0.1:8080",
        MQTT_BROKER_URL: "mqtt://10.2.10.4:9001",
        CAMUNDA_REST_URL: "http://10.2.10.4:8080"
    },
    getters: {},
    mutations: {},
    actions: {}
});