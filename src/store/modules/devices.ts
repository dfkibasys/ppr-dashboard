import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from "@/interfaces/RootState";
import { Device, DevicesState, Capability } from "@/interfaces/DevicesState";
import axios from 'axios';
import store from "..";

const state: DevicesState = {
    devices: []
};

const getters: GetterTree<DevicesState, RootState> = {
    allDevices: (state) => state.devices
};

const actions: ActionTree<DevicesState,RootState> = {
    async fetchDevices({ commit }, { vm }) {
        let mockData = store.getters.mockDataEnabled;
        let basysUrl = store.getters.basysUrl;

        let dev_url = mockData ?
            "/data/device_components.json" :
            `${basysUrl}/services/registry/DEVICE_COMPONENT`,

            inst_url = mockData ?
                "/data/resource_instances.json" :
                `${basysUrl}/services/resourceinstance/`,

            typ_url = mockData ?
                "/data/resource_types.json" :
                `${basysUrl}/services/resourcetype/`;

        let devCount = 0,
            devices: Device[] = [];

        vm.$Progress.start();

        axios
            .all([axios.get(dev_url), axios.get(inst_url), axios.get(typ_url)])
            .then(
                axios.spread((dev, inst, typ) => {

                    function addTeachCapability(index: number, id: string) {
                        axios
                            .get(`${basysUrl}/services/entity/${id}`)
                            .then(ent => {
                                devices[index - 1].capability.push({
                                    name: ent.data.name,
                                    taught: false
                                });
                                capabilityCounter++;
                                checkCallback();
                            });
                    }

                    function addDevice(obj: Device) {
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
                        let obj: Device = {
                            componentId: "",
                            componentName: "",
                            currentMode: "",
                            currentState: "",
                            serial: "",
                            capabilityAssertionId: "",
                            capability: [],
                            type: "",
                            docuLink: "",
                            location: ""
                        }

                        obj.componentId = devs[i].componentId;
                        obj.componentName = devs[i].componentName;
                        obj.currentMode = devs[i].currentMode;
                        obj.currentState = devs[i].currentState;

                        //get instance of device
                        let instance = inst.data.resourceInstances.filter(
                            (val2: any) => val2.id === devs[i].componentId
                        );
                        obj.serial = instance[0].serialNumber;

                        //get capability
                        let capability = [] as Capability[];
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
                        let type = [] as any;
                        for (let i = 0; i < typ.data.catalogues.length; i++) {
                            //loop over resourceTypes
                            type = typ.data.catalogues[i].resourceTypes.filter(
                                (val2: any) => val2.id === typeId
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
                                    .get(`${basysUrl}/services/topology/parent/${topId}`) //+ "?callback=?" treat request as JSONP to avoid cross-domain call issues
                                    .then(response => {

                                        const { data } = response;
                                        obj.location = data.name;
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
                            vm.$Progress.finish();
                            //update new requested files
                            commit('setDevices', devices);
                        }
                    }
                })
            )
            .catch(err => {
                vm.$Progress.fail();
                commit('setDevices', []);
                console.error(err);
            })
    }
};

const mutations: MutationTree<DevicesState> = {
    setDevices: (state, devices) => (state.devices = devices),

    updateDevices: (state, device) => {
        state.devices = state.devices.map((val, index, arr): Device => {
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
                    docuLink: val.docuLink,
                    capabilityAssertionId: val.capabilityAssertionId
                };
            } else {
                //don't change properties
                return val;
            }
        });
    }
};


export const devices: Module<DevicesState, RootState> = {
    state,
    getters,
    mutations,
    actions
}