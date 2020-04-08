import Vue from "vue";
import axios from 'axios';
import store from "../../store";

const state = {
    devices: []
};

const getters = {
    allDevices: (state) => state.devices
};

const actions = {
    async fetchDevices({commit}) {
        let mockData = store.getters.mockDataEnabled;
        let basysUrl = store.getters.basysUrl;

        let dev_url = mockData ?
            "/data/device_components.json" :
            basysUrl +
            "/services/registry/DEVICE_COMPONENT",
            inst_url = mockData ?
            "/data/resource_instances.json" :
            basysUrl + "/services/resourceinstance/",
            typ_url = mockData ?
            "/data/resource_types.json" :
            basysUrl + "/services/resourcetype/";

        let devCount = 0,
            devices = [];

        Vue.prototype.$Progress.start();

        axios
            .all([axios.get(dev_url), axios.get(inst_url), axios.get(typ_url)])
            .then(
                axios.spread((dev, inst, typ) => {
                    
                    function addTeachCapability(index, id) {
                        axios
                            .get(
                                basysUrl + "/services/entity/" + id
                            )
                            .then(ent => {
                                //console.log("adding "+ent.data.name+"to" , devices[index-1]);
                                devices[index - 1].capability.push({
                                    name: ent.data.name,
                                    taught: false
                                });
                                capabilityCounter++;
                                checkCallback();
                            });
                    }

                    function addDevice(obj) {
                        let index = devices.push(obj);

                        if (!mockData) {
                            addTeachCapability(index, obj.capabilityAssertionId);
                        }

                        devCount++;
                        checkCallback();
                    }

                    let capabilityCounter = 0;

                    let devs = dev.data;

                    for (let i = 0; i < devs.length; i++) {
                        let obj = {};
                        obj.componentId = devs[i].componentId;
                        obj.componentName = devs[i].componentName;
                        obj.currentMode = devs[i].currentMode;
                        obj.currentState = devs[i].currentState;

                        //get instance of device
                        let instance = inst.data.resourceInstances.filter(
                            val2 => val2.id === devs[i].componentId
                        );
                        obj.serial = instance[0].serialNumber;

                        //get capability
                        let capability = [];
                        obj.capabilityAssertionId = instance[0].capabilityApplications[0].capabilityAssertion.$ref.substr(
                            instance[0].capabilityApplications[0].capabilityAssertion.$ref.lastIndexOf(
                                "/"
                            ) + 1
                        );

                        if (
                            typeof instance[0].capabilityApplications[0]
                            .capabilityVariants !== "undefined"
                        ) {
                            for (
                                let i = 0; i <
                                instance[0].capabilityApplications[0].capabilityVariants
                                .length; i++
                            ) {
                                capability.push({
                                    id: instance[0].capabilityApplications[0].capabilityVariants[
                                        i
                                    ].id, //needed for removing
                                    name: instance[0].capabilityApplications[0].capabilityVariants[
                                        i
                                    ].name,
                                    taught: true
                                });
                            }
                        }

                        obj.capability = capability;

                        //get type of instance
                        let typeId = instance[0].resourceType.$ref.substr(
                            instance[0].resourceType.$ref.lastIndexOf("/") + 1
                        );

                        //loop over manufactures
                        let type = "";
                        for (let i = 0; i < typ.data.catalogues.length; i++) {
                            //loop over resourceTypes
                            type = typ.data.catalogues[i].resourceTypes.filter(
                                val2 => val2.id === typeId
                            );
                            if (type.length > 0) break; //resource found! Stop searching and overriding type
                        }
                        obj.type = type[0].name;
                        obj.docuLink = type[0].documentation;

                        //get topology of instance
                        if (typeof instance[0].role !== "undefined") {
                            let topId = instance[0].role.$ref.substr(
                                instance[0].role.$ref.lastIndexOf("/") + 1
                            );
                            if (!mockData) {
                                axios
                                    .get(
                                        basysUrl +
                                        "/services/topology/parent/" +
                                        topId
                                    ) //+ "?callback=?" treat request as JSONP to avoid cross-domain call issues
                                    .then(top => {
                                        obj.location = top.name;
                                        addDevice(obj);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        obj.location = "Not Found";
                                        addDevice(obj);
                                    });
                            } else {
                                obj.location = "S1";
                                addDevice(obj);
                            }
                        } else {
                            obj.location = "Not Found";
                            addDevice(obj);
                        }
                    }

                    checkCallback();

                    //all data needs to be loaded first before executing main()
                    function checkCallback() {
                        if (mockData) {
                            capabilityCounter = devs.length;
                        }

                        if (
                            devCount === devs.length &&
                            capabilityCounter === devs.length
                        ) {
                            Vue.prototype.$Progress.finish();
                            //update new requested files
                            commit('setDevices', devices);
                        }
                    }
                })
            )
            .catch(err => {
                Vue.prototype.$Progress.fail();
                commit('setDevices', []);
                console.error(err);
            })
    }
};

const mutations = {
    setDevices: (state, devices) => (state.devices = devices),

    updateDevices: (state, device) => {
        state.devices = state.devices.map((val, index, arr) => {
            if (val.componentId === device.componentId) {
              //update currentMode and currentState
              return {
                componentId: val.componentId,
                type: val.type,
                componentName: val.componentName,
                location: val.location,
                serial: val.serial,
                capability: val.capability,
                currentMode: device.currentMode, //update
                currentState: device.currentState, //update
                docuLink: val.docuLink
              };
            } else {
              //don't change properties
              return val;
            }
          });
    }
};


export default {
    state,
    getters,
    mutations,
    actions
}