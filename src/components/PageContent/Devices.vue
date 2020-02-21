<template>
    <div>
        <div class="cardContainer" id="deviceContainer">
            <div class="card" v-for="(device, index) in devices" :key="device.id">
                <div class="card-header">
                    <h5 class="card-title">{{device.componentName}}
                        <b-button v-b-modal.modal-pack
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
    import PackML from "../PackML";
    import CapabilityOverview from "../CapabilityOverview";

    export default {
        name: "Devices",
        components: {
            PackML,
            CapabilityOverview
        },
        data() {
            return {
                currentCapabilities: []
            }
        },
        props: {
            devices: Array
        },
        methods: {
            openCapabilityOverview: function(index){
                this.currentCapabilities = this.devices[index].capability;
                this.$bvModal.show("modal-cap");
            }
        }
    }
</script>

<style lang="less">
</style>