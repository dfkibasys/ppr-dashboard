import Vue from "vue";
import Vuex from "vuex";
import endpoints from "./modules/endpoints"

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        endpoints
    }
});