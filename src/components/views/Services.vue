<template>
    <div class="cardContainer" id="serviceContainer">
        <div class="card" v-for="service in services">
            <div class="card-header">
                <h5 class="card-title">{{service.componentName}}</h5>
            </div>
            <div class="card-body">
                <div class="container">
                    <div class="row">
                        <div class="col-4">
                           <b-icon-gear-fill font-scale="7.5"></b-icon-gear-fill>
                        </div>
                        <div class="col-3">
                            {{$t("translation.type_k")}}: <br>
                            {{$t("translation.location_k")}}: <br>
                        </div>
                        <div class="col-5">
                            {{service.type}}<br>
                            {{service.location}}<br>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Services",
        data() {
            return {
                services: []
            }
        },
        methods: {
            loadInitialData: function (mockData, callback) {
                let that = this;
                let serv_url = (mockData) ? "/data/service_components.json" :that.$store.state.BASYS_REST_URL + "/services/registry/SERVICE_COMPONENT";
                let services = [];

                axios.get(serv_url)
                    .then(serv => {


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

                        that.services = services;

                    }).catch((err) => {
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

<style lang="less">
</style>