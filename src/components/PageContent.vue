<template>
    <div>
        <Devices v-if="route === 'devices'" v-bind:devices="devices"></Devices>
        <Services v-else-if="route === 'services'" v-bind:services="services"></Services>
        <Management v-else-if="route === 'managements'" v-bind:managements="managements"></Management>

    </div>
</template>

<script>
    import axios from 'axios';

    import Devices from './PageContent/Devices'
    import Services from "./PageContent/Services";
    import Management from "./PageContent/Management";

    export default {
        name: "PageContent",
        components: {
            Management,
            Devices,
            Services
        },
        data() {
            return {
                route: "devices",
                hostname: "http://10.2.10.3:8080",
                devices: [],
                services: [],
                managements: []
            }
        },
        methods: {
            loadInitialData: function (mockData, callback) {
                let that = this;

                let dev_url = (mockData) ? "/data/device_components.json" : that.hostname + "/services/registry/DEVICE_COMPONENT",
                    man_url = (mockData) ? "/data/management_components.json" : that.hostname + "/services/registry/MANAGEMENT_COMPONENT",
                    serv_url = (mockData) ? "/data/service_components.json" : that.hostname + "/services/registry/SERVICE_COMPONENT",
                    inst_url = (mockData) ? "/data/resource_instances.json" : that.hostname + "/services/resourceinstance/",
                    typ_url = (mockData) ? "/data/resource_types.json" : that.hostname + "/services/resourcetype/";
                    //lic_url = "/licenses/releaseLICENSES";

                let devCount = 0,
                    devices = [],
                    services = [],
                    management = [],
                    licenses = [];

                axios.all([
                    axios.get(dev_url),
                    axios.get(man_url),
                    axios.get(serv_url),
                    axios.get(inst_url),
                    axios.get(typ_url)
                    //axios.get(lic_url)
                ])
                    .then(axios.spread((dev, man, serv, inst, typ) => { //,lic

                        function addTeachCapability(index, id) {
                            axios.get(that.hostname + '/services/entity/' + id)
                                .then(ent => {
                                    //console.log("adding "+ent.data.name+"to" , devices[index-1]);
                                    devices[index - 1].capability.push({
                                        'name': ent.data.name,
                                        'taught': false
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
                            let instance = inst.data.resourceInstances.filter(val2 => val2.id === devs[i].componentId);

                            obj.serial = instance[0].serialNumber;

                            //get capability
                            let capability = [];
                            obj.capabilityAssertionId = instance[0].capabilityApplications[0].capabilityAssertion.$ref.substr(instance[0].capabilityApplications[0].capabilityAssertion.$ref.lastIndexOf('/') + 1);

                            if (typeof instance[0].capabilityApplications[0].capabilityVariants !== "undefined") {
                                for (let i = 0; i < instance[0].capabilityApplications[0].capabilityVariants.length; i++) {
                                    capability.push({
                                        'id': instance[0].capabilityApplications[0].capabilityVariants[i].id, //needed for removing
                                        'name': instance[0].capabilityApplications[0].capabilityVariants[i].name,
                                        'taught': true
                                    });
                                }
                            }


                            obj.capability = capability;

                            //get type of instance
                            let typeId = instance[0].resourceType.$ref.substr(instance[0].resourceType.$ref.lastIndexOf('/') + 1);

                            //loop over manufactures
                            let type = "";
                            for (let i = 0; i < typ.data.catalogues.length; i++) {
                                //loop over resourceTypes
                                type = typ.data.catalogues[i].resourceTypes.filter(val2 => val2.id === typeId);
                                if (type.length > 0) break; //resource found! Stop searching and overriding type
                            }
                            obj.type = type[0].name;
                            obj.docuLink = type[0].documentation;

                            //get topology of instance
                            if (typeof instance[0].role !== 'undefined') {
                                let topId = instance[0].role.$ref.substr(instance[0].role.$ref.lastIndexOf('/') + 1);
                                if (!mockData) {
                                    axios.get(that.hostname + "/services/topology/parent/" + topId) //+ "?callback=?" treat request as JSONP to avoid cross-domain call issues
                                        .then(top => {
                                            obj.location = top.name;
                                            addDevice(obj);
                                        })
                                        .catch(() => {
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

                        //services
                        services = serv.data.map((val, index, arr) => {
                            // return element to new Array
                            return {
                                "componentId": val.componentId,
                                "type": "Service",
                                "componentName": val.componentName,
                                "location": val.hostName
                            };
                        });

                        //management
                        management = man.data.map((val, index, arr) => {
                            // return element to new Array
                            return {
                                "componentId": val.componentId,
                                "type": "Management",
                                "componentName": val.componentName,
                                "location": val.hostName
                            };
                        });

                        /*licenses = Object.keys(lic[0]).map(function (key) {
                            return {'name': key, 'type': lic[0][key].licenses};
                        });*/

                        checkCallback();

                        //all data needs to be loaded first before executing main()
                        function checkCallback() {
                            //console.log(devCount, devs.length);
                            // console.log(services.length , serv[0].length);
                            // console.log(management.length, man[0].length);

                            if (mockData) {
                                capabilityCounter = devs.length;
                            }

                            if (devCount === devs.length &&
                                services.length === serv.data.length &&
                                management.length === man.data.length &&
                                capabilityCounter === devs.length
                            ) {
                                //update new requested files
                                that.devices = devices;
                                that.services = services;
                                that.managements = management;
                                //ko.mapping.fromJS(licenses, viewModel.licenses);

                                //console.log("new devices", devices);
                                callback();
                            }

                        }

                    })).catch(() => {
                    console.log("Failed to get JSON data");
                    /* $(".alert-danger span").text(`Failed to get all JSON data from ${viewModel.restConfig.hostname()}`).show();
                        $(".alert-danger").show();*/
                });

            }
        },
        mounted() {
            this.loadInitialData(false, function(){});
        }
    }
</script>

<style lang="less">
    .cardContainer {
        .card {
            width: 500px;
            margin: 10px;
            float: left;
            background-color: lighten(#555555, 15%);
            color: white;
            text-align: left;

            .card-body {
                padding-left: 0;
                padding-right: 0;
                height: 145px;

                .image {
                    align-self: center;

                    img {
                        max-height: 90px;
                        max-width: 160px;
                    }
                }

                .properties {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    a {
                        color: #1fc8e3;
                    }
                }
            }

        }
    }
</style>