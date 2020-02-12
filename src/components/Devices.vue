<template>
    <div class="cardContainer" id="deviceContainer">
        <div class="card" v-for="device in devices" :key="device.id">
            <div class="card-header">
                <h5 class="card-title"><span>{{device.componentName}}</span>
                    <button type="button" data-toggle="modal" data-target="#finiteAutomaton"
                            class="btn btn-info float-right"
                            data-bind="attr: { 'data-state': currentState, 'data-index': $index }">
                        <span>{{device.currentMode}}</span> -
                        <span>{{device.currentState}}</span>
                    </button>
                </h5>
            </div>
            <div class="card-body">
                <div class="container">
                    <div class="row">
                        <div class="col-4 image">
                            <img data-bind="attr: { 'src': '/img/' + type() + '.png' }"/>
                        </div>
                        <div class="col-3">
                            {{$t("translation.type_k")}}: <br>
                            <!-- {{$t("translation.location_k")}}: <br> -->
                            {{$t("translation.serial_k")}}: <br>
                            {{$t("translation.capability_k")}}: <br>
                        </div>
                        <div class="col-5 properties">
                            <a target="_blank" data-bind="attr: { href: docuLink }"><span>{{device.type}}</span></a>
                            <br>
                            <!--                         <span data-bind="text: location"></span><br> -->
                            <span>{{device.serial}}</span><br>
                            <span>{{device.capability.length-1}}</span> <a href="#capabilityOverview"
                                                                                     data-toggle="modal"
                                                                                     data-target="#capabilityOverview"
                                                                                     data-bind="attr: {'data-index': $index}"
                                                                                     class="cap-link">(<span
                                data-bind="i18n: 'show'"></span>)</a><br>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Devices",
        data() {
            return {
                devices: [{
                    id: 1,
                    componentName: "My MiR",
                    currentMode: "AA",
                    currentState: "BB",
                    serial: 3232,
                    type: "MiR 100",
                    capability: ["Pick and Place", "default"]
                }]
            }
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