<template>
  <div class="cardContainer" id="serviceContainer">
    <div class="card" v-for="service in services" :key="service.componentId">
      <div class="card-header">
        <h5 class="card-title">{{ service.componentName }}</h5>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="row">
            <div class="col-4">
              <b-icon-gear-fill font-scale="7.5"></b-icon-gear-fill>
            </div>
            <div class="col-3">
              {{ $t('card.type') }}:
              <br />
              {{ $t('card.location') }}:
              <br />
            </div>
            <div class="col-5">
              {{ service.type }}
              <br />
              {{ service.location }}
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IServices';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'Services',
  data() {
    return {
      services: [],
    };
  },
  computed: {
    ...mapGetters('endpoints', {
      mockDataEnabled: 'mockDataEnabled',
    }),
  },
  methods: {
    loadInitialData: function (mockData, callback) {
      let that = this;
      let serv_url = mockData
        ? '/data/service_components.json'
        : `NEEDS_TO_BE_SET/services/registry/SERVICE_COMPONENT`;
      let services = [];

      this.$Progress.start();

      axios
        .get(serv_url)
        .then((serv) => {
          this.$Progress.finish();
          //services
          services = serv.data.map((val: any) => {
            // return element to new Array
            return {
              componentId: val.componentId,
              type: 'Service',
              componentName: val.componentName,
              location: val.hostName,
            };
          });

          that.services = services;
        })
        .catch((err) => {
          this.$Progress.fail();
          console.error(err);
        });
    },
  },
  mounted() {
    this.loadInitialData(this.mockDataEnabled);
  },
});
</script>

<style lang="scss"></style>
