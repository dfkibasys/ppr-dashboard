<template>
  <b-container>
    <b-breadcrumb :items="bcItems"></b-breadcrumb>
    <h2>{{$t('process.deployed')}}</h2>
    <b-row>
      <b-col>
        <span>{{$tc("process.processDefinition", processDefinitionsCount)}}</span>
        <b-link to="/processes/overview">
          <h3>{{processDefinitionsCount}}</h3>
        </b-link>
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
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Processes",
  data() {
    return {
      bcItems: [
        {
          text: this.$t('process.breadcrumb.processes'),
          to: "/processes",
          active: true
        }
      ],
      processDefinitionsCount: 0,
      decisionDefinitionsCount: 0,
      caseDefinitionsCount: 0,
      deploymentsCount: 0
    };
  },
  created() {
    let that = this;
    let baseUrl = process.env.VUE_APP_AJAX_REQUEST_DOMAIN; //camundaUrl + "/engine-rest"
    that.$Progress.start();

    axios
      .all([
        axios.get(`${baseUrl}/process-definition/count?latestVersion=true`),
        axios.get(`${baseUrl}/decision-definition/count`),
        axios.get(`${baseUrl}/case-definition/count`),
        axios.get(`${baseUrl}/deployment/count`)
      ])
      .then(
        axios.spread((pdc, ddc, cdc, dc) => {
          that.processDefinitionsCount = pdc.data.count;
          that.decisionDefinitionsCount = ddc.data.count;
          that.caseDefinitionsCount = cdc.data.count;
          that.deploymentsCount = dc.data.count;
          that.$Progress.finish();
        })
      )
      .catch(err => {
        that.$Progress.fail();
        console.error(err);
      });
  }
};
</script>

<style>
</style>