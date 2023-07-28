<template>
  <div class="container">
    <breadcrumb :items="bcItems"></breadcrumb>
    <h2>{{ $t('process.deployed') }}</h2>
    <div class="row pb-5">
      <div class="col">
        <span>{{ $t('process.processDefinition', processDefinitionsCount) }}</span>
        <h3>{{ processDefinitionsCount }}</h3>
      </div>
      <div class="col">
        <span>{{ $t('process.decisionDefinition', decisionDefinitionsCount) }}</span>
        <h3>{{ decisionDefinitionsCount }}</h3>
      </div>
      <div class="col">
        <span>{{ $t('process.caseDefinition', caseDefinitionsCount) }}</span>
        <h3>{{ caseDefinitionsCount }}</h3>
      </div>
      <div class="col">
        <span>{{ $t('process.deployment', deploymentsCount) }}</span>
        <h3>{{ deploymentsCount }}</h3>
      </div>
    </div>
    <div class="row pt-5">
      <div class="col">
        <h2>{{ $t('process.processDefinition', processDefinitionsCount) }}</h2>
        <table class="table table-striped table-hover clickable-table">
          <thead>
            <tr>
              <th scope="col">{{ $t('process.instances') }}</th>
              <th scope="col">{{ $t('process.name') }}</th>
              <th scope="col">{{ $t('process.key') }}</th>
              <th scope="col">{{ $t('process.tenantId') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="def in processDefinitions" :key="def.key" @click="goToProcessView(def)">
              <td>{{ def.instances }}</td>
              <td>{{ def.name }}</td>
              <td>{{ def.key }}</td>
              <td>{{ def.tenantId || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { Data, Methods, Computed, Props } from '@/interfaces/IProcesses';
import getEnv from '@/helpers/env';
import Breadcrumb from '@/components/common/Breadcrumb.vue';

export default defineComponent({
  components: { Breadcrumb },
  name: 'Processes',
  data() {
    return {
      bcItems: [
        {
          text: this.$t('process.breadcrumb.overview'),
          to: '/processes',
          active: true,
        },
      ],
      processDefinitionsCount: 0,
      decisionDefinitionsCount: 0,
      caseDefinitionsCount: 0,
      deploymentsCount: 0,
      processDefinitions: [],
    };
  },
  methods: {
    goToProcessView(item) {
      this.$router.push({ name: 'ProcessesDetails', params: { pid: item.id } });
    },
  },
  created() {
    let that = this;
    let baseUrl = getEnv('VITE_AJAX_REQUEST_DOMAIN'); //camundaUrl + "/engine-rest"
    //this.$Progress.start();

    axios
      .all([
        axios.get(`${baseUrl}/process-definition/count?latestVersion=true`),
        axios.get(`${baseUrl}/decision-definition/count`),
        axios.get(`${baseUrl}/case-definition/count`),
        axios.get(`${baseUrl}/deployment/count`),
        axios.get(`${baseUrl}/process-definition?latestVersion=true`),
      ])
      .then(
        axios.spread((pdc, ddc, cdc, dc, pd) => {
          that.processDefinitionsCount = pdc.data.count;
          that.decisionDefinitionsCount = ddc.data.count;
          that.caseDefinitionsCount = cdc.data.count;
          that.deploymentsCount = dc.data.count;

          that.processDefinitions = pd.data;

          that.processDefinitions.forEach((pp: any) => {
            axios
              .get(`${baseUrl}/process-instance/count`, {
                params: {
                  processDefinitionKey: pp.key,
                },
              })
              .then((res) => {
                //add reactive properties to nested object
                pp['instances'] = res.data.count;
              })
              .catch((err) => {
                //this.$Progress.fail();
                console.error(err);
              });
          });

          //this.$Progress.finish();
        })
      )
      .catch((err) => {
        //this.$Progress.fail();
        console.error(err);
      });
  },
});
</script>

<style></style>
