<template>
  <b-container>
    <h2>Deployed</h2>
    <b-row>
      <b-col>
        <span>Process Definitions</span>
        <b-link to="/processes/overview">
          <h3>{{getProcessDefintionsCount || 0}}</h3>
        </b-link>
      </b-col>
      <b-col>
        <span>Decision Definitions</span>
        <h3>{{getDecisionDefinitionsCount || 0}}</h3>
      </b-col>
      <b-col>
        <span>Case Definitions</span>
        <h3>{{getCaseDefinitionsCount || 0}}</h3>
      </b-col>
      <b-col>
        <span>Deployments</span>
        <h3>{{getDeploymentsCount || 0}}</h3>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Processes",
  computed: mapGetters([
    "getProcessDefintionsCount",
    "getDecisionDefinitionsCount",
    "getCaseDefinitionsCount",
    "getDeploymentsCount"
  ]),
  methods: {
    ...mapActions(["fetchCounts"])
  },
  created() {
    this.fetchCounts();
  }
};
</script>

<style>
</style>