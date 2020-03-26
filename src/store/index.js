import Vue from "vue";
import Vuex from "vuex";
import endpoints from "./modules/endpoints";
import devices from "./modules/devices";
import processes from "./modules/processes";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        endpoints,
        devices,
        processes
    }
});