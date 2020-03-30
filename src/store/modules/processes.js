import axios from 'axios';
import store from "../../store";

const state = {
    processDefinitionsCount: 0,
    decisionDefinitionsCount: 0,
    caseDefinitionsCount: 0,
    deploymentsCount: 0,
    processDefinitions: [],
    processDefinition: {},
    processDefinitionXML: "",
    processInstances: [],
    auditLog: [],
    currentVersionID: null,
    versions: []
}

const getters = {
    getProcessDefintionsCount: (state) => state.processDefinitionsCount,
    getDecisionDefinitionsCount: (state) => state.decisionDefinitionsCount,
    getCaseDefinitionsCount: (state) => state.caseDefinitionsCount,
    getDeploymentsCount: (state) => state.deploymentsCount,
    getProcessDefinitions: (state) => state.processDefinitions,
    getProcessDefinitionById: (state) => state.processDefinition,
    getProcessDefinitionXML: (state) => state.processDefinitionXML,
    getProcessInstances: (state) => state.processInstances,
    getAuditLog: (state) => state.auditLog,
    getCurrentVersionID: (state) => state.currentVersionID,
    getVersions: (state) => state.versions
}

const mutations = {
    setProcessDefintionsCount: (state, count) => (state.processDefinitionsCount = count),
    setDecisionDefinitionsCount: (state, count) => (state.decisionDefinitionsCount = count),
    setCaseDefinitionsCount: (state, count) => (state.caseDefinitionsCount = count),
    setDeploymentsCount: (state, count) => (state.deploymentsCount = count),
    setProcessDefinitions: (state, definitions) => (state.processDefinitions = definitions),
    setProcessDefinitionById: (state, definition) => (state.processDefinition = definition),
    setProcessDefinitionXML: (state, xml) => (state.processDefinitionXML = xml),
    setProcessInstances: (state, instances) => (state.processInstances = instances),
    setAuditLog: (state, log) => (state.auditLog = log),
    setCurrentVersionID: (state, id) => (state.currentVersionID = id),
    setVersions: (state, versions) => (state.versions = versions)
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

            commit("setCurrentVersionID", res.data.id);

            axios.get(baseUrl + "/process-definition?key=" + res.data.key)
            .then(pds => {
                let versions = [];
                pds.data.forEach(val => {
                    //formatting for b-form-select component
                    versions.push({value: val.id, text: val.version});
                });
                commit("setVersions", versions);
            })
            .catch(err => {
                console.log("Error", err);
                
            })

            axios.get(baseUrl + "/process-instance?processDefinitionId=" + res.data.id)
            .then(res => {
                commit("setProcessInstances", res.data);
            })
            .catch(err => {
                console.error(err);
            })
            commit("setProcessDefinitionById", res.data);
        })
        .catch(err => {
            console.error(err);
        })
    },
    fetchProcessDefinitionXML({commit}, id){
        let baseUrl = store.getters.camundaUrl + '/engine-rest';

        axios.get(baseUrl + "/process-definition/" + id + "/xml")
        .then(res => {
            commit("setProcessDefinitionXML", res.data.bpmn20Xml);
        })
    },
    fetchActivityInstance({commit}, id){
        let baseUrl = store.getters.camundaUrl + '/engine-rest';
        
        axios.get(baseUrl + "/history/activity-instance", {
            params: {
                processDefinitionId: id,
                sortBy: 'startTime',
                sortOrder: 'asc'
            }
        })
        .then(res => {
            commit("setAuditLog", res.data);
            
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}