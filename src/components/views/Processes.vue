<template>
  <b-container>
    <h2>Deployed</h2>
    <b-row>
      <b-col>
        <span>Process Definitions</span>
        <b-link to="/processes/overview">
          <h3>{{ctrl.processDefinitionsCount || 0}}</h3>
        </b-link>
      </b-col>
      <b-col>
        <span>Decision Definitions</span>
        <h3>{{ctrl.decisionDefinitionsCount || 0}}</h3>
      </b-col>
      <b-col>
        <span>Case Definitions</span>
        <h3>{{ctrl.caseDefinitionsCount || 0}}</h3>
      </b-col>
      <b-col>
        <span>Deployments</span>
        <h3>{{ctrl.deploymentsCount || 0}}</h3>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Processes",
  data() {
    return {
      ctrl: {
        processDefinitionsCount: 1,
        decisionDefinitionsCount: 1,
        caseDefinitionsCount: 1,
        deploymentsCount: 1
      }
    };
  }
};
</script>

<style>
</style>