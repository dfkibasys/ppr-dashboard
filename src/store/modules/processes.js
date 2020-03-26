import axios from 'axios';
import store from "../../store";

const state = {
    processDefinitionsCount: 0,
    decisionDefinitionsCount: 0,
    caseDefinitionsCount: 0,
    deploymentsCount: 0,
    processDefinitions: [],
    processDefinition: {}
}

const getters = {
    getProcessDefintionsCount: (state) => state.processDefinitionsCount,
    getDecisionDefinitionsCount: (state) => state.decisionDefinitionsCount,
    getCaseDefinitionsCount: (state) => state.caseDefinitionsCount,
    getDeploymentsCount: (state) => state.deploymentsCount,
    getProcessDefinitions: (state) => state.processDefinitions,
    getProcessDefinitionById: (state) => state.processDefinition
}

const mutations = {
    setProcessDefintionsCount: (state, count) => (state.processDefinitionsCount = count),
    setDecisionDefinitionsCount: (state, count) => (state.decisionDefinitionsCount = count),
    setCaseDefinitionsCount: (state, count) => (state.caseDefinitionsCount = count),
    setDeploymentsCount: (state, count) => (state.deploymentsCount = count),
    setProcessDefinitions: (state, definitions) => (state.processDefinitions = definitions),
    setProcessDefinitionById: (state, definition) => (state.processDefinition = definition)
}

const actions = {
    fetchCounts({
        commit
    }) {

        let baseUrl = store.getters.camundaUrl + '/engine-rest';
        axios.get(baseUrl + "/process-definition/count?latestVersion=true")
            .then(res => {
                commit("setProcessDefintionsCount", res.data.count);
            })
            .catch(err => {
                console.error(err);
            });

        axios.get(baseUrl + "/decision-definition/count")
            .then(res => {
                commit("setDecisionDefinitionsCount", res.data.count);
            })
            .catch(err => {
                console.error(err);
            });

        axios.get(baseUrl + "/case-definition/count")
            .then(res => {
                commit("setCaseDefinitionsCount", res.data.count);
            })
            .catch(err => {
                console.error(err);
            });

        axios.get(baseUrl + "/deployment/count")
            .then(res => {
                commit("setDeploymentsCount", res.data.count);
            })
            .catch(err => {
                console.error(err);
            });
    },
    fetchProcessDefinitions({
        commit
    }) {
        let baseUrl = store.getters.camundaUrl + '/engine-rest';
        let processDefinitions = [];

        axios.get(baseUrl + "/process-definition?latestVersion=true")
            .then(res => {
                processDefinitions = res.data;
                let receivedCounts = 0;
           
                processDefinitions.map(pp => {
                    axios.get(baseUrl + "/process-instance/count", {
                            params: {
                                processDefinitionKey: pp.key
                            }
                        })
                        .then(res => {
                            pp.instances = res.data.count;
                            receivedCounts++;
                            if (receivedCounts == processDefinitions.length){
                                commit("setProcessDefinitions", processDefinitions);
                            }
                        })
                        .catch (err => {
                            console.error(err);
                        })
                });
                
            })
            .catch(err => {
                console.error(err);
            });
    },
    fetchProcessDefinitionById({commit}, id){
        let baseUrl = store.getters.camundaUrl + '/engine-rest';

        axios.get(baseUrl + "/process-definition/" + id)
        .then(res => {
            commit("setProcessDefinitionById", res.data);
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}