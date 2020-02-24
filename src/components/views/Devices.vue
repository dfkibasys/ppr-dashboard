<template>
    <div>
        <div class="cardContainer" id="deviceContainer">
            <div class="card" v-for="(device, index) in devices" :key="device.id">
                <div class="card-header">
                    <h5 class="card-title">{{device.componentName}}</h5>
                    <b-button v-b-modal.modal-pack
                              class="btn btn-info float-right"
                              data-bind="attr: { 'data-state': currentState, 'data-index': $index }">
                        {{device.currentMode}} - {{device.currentState}}
                    </b-button>
                </div>
                <div class="card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-4 image">
                                <img :src="require('@/assets/' + device.type + '.png')">
                            </div>
                            <div class="col-3">
                                {{$t("translation.type_k")}}: <br>
                                {{$t("translation.location_k")}}: <br>
                                {{$t("translation.serial_k")}}: <br>
                                {{$t("translation.capability_k")}}: <br>
                            </div>
                            <div class="col-5 properties">
                                <a target="_blank" v-bind:href="device.docuLink">{{device.type}}</a>
                                <br>
                                {{device.location}}<br>
                                {{device.serial}}<br>
                                {{device.capability.length-1}}
                                <a href="#" v-on:click="openCapabilityOverview(index)">({{$t("translation.show")}})</a><br>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <PackML></PackML>
        <CapabilityOverview v-bind:current-capabilities="currentCapabilities"> </CapabilityOverview>
    </div>
</template>

<script>
    import PackML from "../modals/PackML";
    import CapabilityOverview from "../modals/CapabilityOverview";
    import axios from "axios";

    export default {
        name: "Devices",
        components: {
            PackML,
            CapabilityOverview
        },
        data() {
            return {
                currentCapabilities: [],
                devices: []
            }
        },
        methods: {
            openCapabilityOverview: function(index){
                this.currentCapabilities = this.devices[index].capability;
                this.$bvModal.show("modal-cap");
            },
            loadInitialData: function (mockData, callback) {
                let that = this;

                let dev_url = (mockData) ? "/data/device_components.json" : that.$store.state.hostname + "/services/registry/DEVICE_COMPONENT",
                    inst_url = (mockData) ? "/data/resource_instances.json" : that.$store.state.hostname + "/services/resourceinstance/",
                    typ_url = (mockData) ? "/data/resource_types.json" : that.$store.state.hostname + "/services/resourcetype/";

                let devCount = 0,
                    devices = [];

                axios.all([
                    axios.get(dev_url),
                    axios.get(inst_url),
                    axios.get(typ_url)
                ])
                    .then(axios.spread((dev, inst, typ) => { //,lic

                        function addTeachCapability(index, id) {
                            axios.get(that.$store.state.hostname + '/services/entity/' + id)
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
                                    axios.get(that.$store.state.hostname + "/services/topology/parent/" + topId) //+ "?callback=?" treat request as JSONP to avoid cross-domain call issues
                                        .then(top => {
                                            obj.location = top.name;
                                            addDevice(obj);
                                        })
                                        .catch((err) => {
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

                            if (devCount === devs.length &&
                                capabilityCounter === devs.length
                            ) {
                                //update new requested files
                                that.devices = devices;

                                //console.log("new devices", devices);
                                callback();
                            }

                        }

                    })).catch((err) => {
                    console.error(err);
                    /* $(".alert-danger span").text(`Failed to get all JSON data from ${viewModel.restConfig.hostname()}`).show();
                        $(".alert-danger").show();*/
                });

            }
        },
        mounted() {
            this.loadInitialData(false, function () {})
        }
    }
</script>

<style lang="less" scoped>
    h5 {
        width: 50%;
        float: left;
    }
</style>