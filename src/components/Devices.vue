<template>
    <div>
        <div class="cardContainer" id="deviceContainer">
            <div class="card" v-for="device in devices" :key="device.id">
                <div class="card-header">
                    <h5 class="card-title">{{device.componentName}}
                        <b-button v-b-modal.modal-1
                                  class="btn btn-info float-right"
                                  data-bind="attr: { 'data-state': currentState, 'data-index': $index }">
                            {{device.currentMode}} - {{device.currentState}}
                        </b-button>
                    </h5>
                </div>
                <div class="card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-4 image">
                                <img :src="require('../assets/' + device.type + '.png')">
                            </div>
                            <div class="col-3">
                                {{$t("translation.type_k")}}: <br>
                                <!-- {{$t("translation.location_k")}}: <br> -->
                                {{$t("translation.serial_k")}}: <br>
                                {{$t("translation.capability_k")}}: <br>
                            </div>
                            <div class="col-5 properties">
                                <a target="_blank" data-bind="attr: { href: docuLink }">{{device.type}}</a>
                                <br>
                                <!--  {{device.location}}<br> -->
                                {{device.serial}}<br>
                                {{device.capability.length-1}} <a href="#capabilityOverview"
                                                                  data-toggle="modal"
                                                                  data-target="#capabilityOverview"
                                                                  data-bind="attr: {'data-index': $index}"
                                                                  class="cap-link">({{$t("translation.show")}})</a><br>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <PackML></PackML>
    </div>
</template>

<script>
    import PackML from './PackML'
    import axios from 'axios';

    export default {
        name: "Devices",
        components: {
            PackML
        },
        data() {
            return {
                devices: [{
                    id: 1,
                    componentName: "My MiR",
                    currentMode: "AA",
                    currentState: "BB",
                    location: "MRK4.0 Lab",
                    serial: 3232,
                    type: "logo",
                    capability: ["Pick and Place", "default"]
                },
                    {
                        id: 2,
                        componentName: "My KUKA",
                        currentMode: "AA",
                        currentState: "BB",
                        location: "MRK4.0 Lab",
                        serial: 3254332,
                        type: "MiR 100",
                        capability: ["Pick and Place", "default"]
                    }]
            }
        },
        methods: {
            loadInitialData: function (mockData, callback) {
                let that = this;
                let hostname = "http://10.2.10.3:8080";
                let dev_url = (mockData) ? "/data/device_components.json" : hostname + "/services/registry/DEVICE_COMPONENT",
                    man_url = (mockData) ? "/data/management_components.json" : hostname + "/services/registry/MANAGEMENT_COMPONENT",
                    serv_url = (mockData) ? "/data/service_components.json" : hostname + "/services/registry/SERVICE_COMPONENT",
                    inst_url = (mockData) ? "/data/resource_instances.json" : hostname + "/services/resourceinstance/",
                    typ_url = (mockData) ? "/data/resource_types.json" : hostname + "/services/resourcetype/";
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
                            axios.get(hostname + '/services/entity/' + id)
                                .then(ent => {
                                    //console.log("adding "+ent.name+"to" , devices[index-1]);
                                    devices[index - 1].capability.push({
                                        'name': ent.name,
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
                                    axios.get(hostname + "/services/topology/parent/" + topId) //+ "?callback=?" treat request as JSONP to avoid cross-domain call issues
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

                                //ko.mapping.fromJS(services, viewModel.services);
                                //ko.mapping.fromJS(management, viewModel.management);

                                //ko.mapping.fromJS(licenses, viewModel.licenses);
                                that.devices = devices;
                                console.log("new devices", devices);
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
                }
            }

        }
    }
</style>