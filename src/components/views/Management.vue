<template>
  <div class="cardContainer" id="managementContainer">
    <div class="card" v-for="management in managements" :key="management.componentId">
      <div class="card-header">
        <h5 class="card-title">{{ management.componentName }}</h5>
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
              {{ management.type }}
              <br />
              {{ management.location }}
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IManagement';

export default defineComponent({
  name: 'Management',
  data() {
    return {
      managements: [],
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
      let man_url = mockData
        ? '/data/management_components.json'
        : `NEEDS_TO_BE_SET/services/registry/MANAGEMENT_COMPONENT`;
      let management = [];

      this.$Progress.start();

      axios
        .get(man_url)
        .then((man) => {
          this.$Progress.finish();
          //management
          management = man.data.map((val: any) => {
            // return element to new Array
            return {
              componentId: val.componentId,
              type: 'Management',
              componentName: val.componentName,
              location: val.hostName,
            };
          });

          that.managements = management;
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

<style scoped></style>
