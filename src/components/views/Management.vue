<template>
    <div class="cardContainer" id="managementContainer">
        <div class="card" v-for="management in managements">
            <div class="card-header">
                <h5 class="card-title">{{management.componentName}}</h5>
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
                            {{management.type}}<br>
                            {{management.location}}<br>
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
        name: "Management",
        data(){
            return {
                managements: []
            }
        },
        methods: {
            loadInitialData: function (mockData, callback) {
                let that = this;
                let man_url = (mockData) ? "/data/management_components.json" : that.$store.state.hostname + "/services/registry/MANAGEMENT_COMPONENT";
                let management = [];

                axios.get(man_url)
                    .then(man => {

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

                        that.managements = management;

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

<style scoped>

</style>