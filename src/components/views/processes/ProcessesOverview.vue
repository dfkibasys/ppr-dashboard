<template>
  <b-container>
    <h2>Deployed</h2>
    <b-table
      hover
      striped
      @row-clicked="goToProcessView"
      :items="processDefinitions"
      :fields="fields"
    >
      <template v-slot:cell(tenantId)="value">{{value.item.tenantId || "-"}}</template>
    </b-table>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "ProcessesOverview",
  computed: mapGetters(["camundaUrl"]),
  data() {
    return {
      processDefinitions: [],
      fields: ["instances", "name", "key", "tenantId"]
    };
  },
  methods: {
    goToProcessView(item) {
      this.$router.push({ name: "ProcessesDetails", params: { pid: item.id } });
      //console.log(`${item.id} clicked`);
    }
  },
  created() {
    let baseUrl = process.env.VUE_APP_AJAX_REQUEST_DOMAIN;

    axios
      .get(baseUrl + "/process-definition?latestVersion=true")
      .then(res => {
        this.processDefinitions = res.data;

        this.processDefinitions.forEach(pp => {
          axios
            .get(baseUrl + "/process-instance/count", {
              params: {
                processDefinitionKey: pp.key
              }
            })
            .then(res => {
              //add reactive properties to nested object
              this.$set(pp, 'instances', res.data.count);
            })
            .catch(err => {
              console.error(err);
            });
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>

<style>
</style>