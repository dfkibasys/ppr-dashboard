<template>
  <div class="cardContainer" id="serviceContainer">
    <div class="card" v-for="service in services" :key="service.componentId">
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
              {{$t("translation.type_k")}}:
              <br />
              {{$t("translation.location_k")}}:
              <br />
            </div>
            <div class="col-5">
              {{service.type}}
              <br />
              {{service.location}}
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "Services",
  data() {
    return {
      services: []
    };
  },
  computed: mapGetters(["basysUrl"]),
  methods: {
    loadInitialData: function(mockData, callback) {
      let that = this;
      let serv_url = mockData
        ? "/data/service_components.json"
        : that.basysUrl +
          "/services/registry/SERVICE_COMPONENT";
      let services = [];

      axios
        .get(serv_url)
        .then(serv => {
          //services
          services = serv.data.map((val, index, arr) => {
            // return element to new Array
            return {
              componentId: val.componentId,
              type: "Service",
              componentName: val.componentName,
              location: val.hostName
            };
          });

          that.services = services;
        })
        .catch(err => {
          console.error(err);
          /* $(".alert-danger span").text(`Failed to get all JSON data from ${viewModel.restConfig.hostname()}`).show();
                        $(".alert-danger").show();*/
        });
    }
  },
  mounted() {
    this.loadInitialData(false, function() {});
  }
};
</script>

<style lang="less">
</style>