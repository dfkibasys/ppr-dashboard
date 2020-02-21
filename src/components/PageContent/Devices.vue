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
                                <img :src="require('@/assets/' + device.type + '.png')">
                            </div>
                            <div class="col-3">
                                {{$t("translation.type_k")}}: <br>
                                {{$t("translation.location_k")}}: <br>
                                {{$t("translation.serial_k")}}: <br>
                                {{$t("translation.capability_k")}}: <br>
                            </div>
                            <div class="col-5 properties">
                                <a target="_blank" data-bind="attr: { href: docuLink }">{{device.type}}</a>
                                <br>
                                {{device.location}}<br>
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
    import PackML from "../PackML";

    export default {
        name: "Devices",
        components: {
            PackML
        },
        props: {
            devices: Array
        }
    }
</script>

<style lang="less">
</style>