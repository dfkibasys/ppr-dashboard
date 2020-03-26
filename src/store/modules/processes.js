import axios from 'axios';
import store from "../../store";

const state = {
    processDefinitionsCount: 0,
    decisionDefinitionsCount: 0,
    caseDefinitionsCount: 0,
    deploymentsCount: 0
}

const getters = {
    getProcessDefintionsCount: (state) => state.processDefinitionsCount,
    getDecisionDefinitionsCount: (state) => state.decisionDefinitionsCount,
    getCaseDefinitionsCount: (state) => state.caseDefinitionsCount,
    getDeploymentsCount: (state) => state.deploymentsCount
}

const mutations = {
    setProcessDefintionsCount: (state, count) => (state.processDefinitionsCount = count),
    setDecisionDefinitionsCount: (state, count) => (state.decisionDefinitionsCount = count),
    setCaseDefinitionsCount: (state, count) => (state.caseDefinitionsCount = count),
    setDeploymentsCount: (state, count) => (state.deploymentsCount = count)
}

const actions = {
    fetchCounts({commit}) {

        let baseUrl = store.getters.camundaUrl;
        axios.get(baseUrl + "/engine-rest/process-definition/count?latestVersion=true")
        .then(res => {
            commit("setProcessDefintionsCount", res.data.count);
        })
        .catch(err => {
            console.error(err);
        });

        axios.get(baseUrl + "/engine-rest/decision-definition/count")
        .then(res => {
            commit("setDecisionDefinitionsCount", res.data.count);
        })
        .catch(err => {
            console.error(err);
        });

        axios.get(baseUrl + "/engine-rest/case-definition/count")
        .then(res => {
            commit("setCaseDefinitionsCount", res.data.count);
        })
        .catch(err => {
            console.error(err);
        });

        axios.get(baseUrl + "/engine-rest/deployment/count")
        .then(res => {
            commit("setDeploymentsCount", res.data.count);
        })
        .catch(err => {
            console.error(err);
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}