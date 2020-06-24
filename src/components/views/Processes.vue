<template>
  <b-container>
    <b-breadcrumb :items="bcItems"></b-breadcrumb>
    <h2>{{$t('process.deployed')}}</h2>
    <b-row class="pb-5">
      <b-col>
        <span>{{$tc("process.processDefinition", processDefinitionsCount)}}</span>
        <h3>{{processDefinitionsCount}}</h3>
      </b-col>
      <b-col>
        <span>{{$tc("process.decisionDefinition", decisionDefinitionsCount)}}</span>
        <h3>{{decisionDefinitionsCount}}</h3>
      </b-col>
      <b-col>
        <span>{{$tc("process.caseDefinition", caseDefinitionsCount)}}</span>
        <h3>{{caseDefinitionsCount}}</h3>
      </b-col>
      <b-col>
        <span>{{$tc("process.deployment", deploymentsCount)}}</span>
        <h3>{{deploymentsCount}}</h3>
      </b-col>
    </b-row>
    <b-row class="pt-5">
      <b-col>
        <h2>{{$tc('process.processDefinition', processDefinitionsCount)}}</h2>
        <b-table
          hover
          striped
          @row-clicked="goToProcessView"
          :items="processDefinitions"
          :fields="fields"
          class="clickable-table"
        >
          <template v-slot:head(instances)>{{ $t('process.instances') }}</template>
          <template v-slot:head(name)>{{ $t('process.name') }}</template>
          <template v-slot:head(key)>{{ $t('process.key') }}</template>
          <template v-slot:head(tenantId)>{{ $t('process.tenantId') }}</template>
          <template v-slot:cell(tenantId)="value">{{value.item.tenantId || "-"}}</template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from "axios";
import { Data, Methods, Computed, Props } from "@/interfaces/IProcesses";

export default Vue.extend<Data, Methods, Computed, Props>({
  name: "Processes",
  data() {
    return {
      bcItems: [
        {
          text: this.$t("process.breadcrumb.overview"),
          to: "/processes",
          active: true
        }
      ],
      processDefinitionsCount: 0,
      decisionDefinitionsCount: 0,
      caseDefinitionsCount: 0,
      deploymentsCount: 0,
      processDefinitions: [],
      fields: ["instances", "name", "key", "tenantId"]
    };
  },
  methods: {
    goToProcessView(item) {
      this.$router.push({ name: "ProcessesDetails", params: { pid: item.id } });
    }
  },
  created() {
    let that = this;
    let baseUrl = process.env.VUE_APP_AJAX_REQUEST_DOMAIN; //camundaUrl + "/engine-rest"
    this.$Progress.start();

    axios
      .all([
        axios.get(`${baseUrl}/process-definition/count?latestVersion=true`),
        axios.get(`${baseUrl}/decision-definition/count`),
        axios.get(`${baseUrl}/case-definition/count`),
        axios.get(`${baseUrl}/deployment/count`),
        axios.get(`${baseUrl}/process-definition?latestVersion=true`)
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
                  processDefinitionKey: pp.key
                }
              })
              .then(res => {
                //add reactive properties to nested object
                that.$set(pp, "instances", res.data.count);
              })
              .catch(err => {
                this.$Progress.fail();
                console.error(err);
              });
          });

          this.$Progress.finish();
        })
      )
      .catch(err => {
        this.$Progress.fail();
        console.error(err);
      });
  }
});
</script>

<style>
</style>