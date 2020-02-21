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
    export default {
        name: "Services",
        props: {
            services: Array
        }
    }
</script>

<style lang="less">
</style>