<template>
  <b-container>
    <b-breadcrumb :items="bcItems"></b-breadcrumb>
    <h2>Deployed</h2>
    <b-row>
      <b-col>
        <span>Process Definitions</span>
        <b-link to="/processes/overview">
          <h3>{{processDefinitionsCount || 0}}</h3>
        </b-link>
      </b-col>
      <b-col>
        <span>Decision Definitions</span>
        <h3>{{decisionDefinitionsCount || 0}}</h3>
      </b-col>
      <b-col>
        <span>Case Definitions</span>
        <h3>{{caseDefinitionsCount || 0}}</h3>
      </b-col>
      <b-col>
        <span>Deployments</span>
        <h3>{{deploymentsCount || 0}}</h3>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Processes",
  data() {
    return {
      bcItems: [
        {
          text: "Processes",
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
  computed: mapGetters(["camundaUrl"]),
  created() {
    let baseUrl = process.env.VUE_APP_AJAX_REQUEST_DOMAIN; //this.camundaUrl + "/engine-rest"

    axios
      .all([
        axios.get(baseUrl + "/process-definition/count?latestVersion=true"),
        axios.get(baseUrl + "/decision-definition/count"),
        axios.get(baseUrl + "/case-definition/count"),
        axios.get(baseUrl + "/deployment/count")
      ])
      .then(
        axios.spread((pdc, ddc, cdc, dc) => {
          this.processDefinitionsCount = pdc.data.count;
          this.decisionDefinitionsCount = ddc.data.count;
          this.caseDefinitionsCount = cdc.data.count;
          this.deploymentsCount = dc.data.count;
        })
      )
      .catch(err => {
        console.error(err);
      });
  }
};
</script>

<style>
</style>