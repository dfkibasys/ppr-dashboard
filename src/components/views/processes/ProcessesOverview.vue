<template>
  <b-container>
    <b-breadcrumb :items="bcItems"></b-breadcrumb>
    <h2>Deployed</h2>
    <b-table
      hover
      striped
      @row-clicked="goToProcessView"
      :items="processDefinitions"
      :fields="fields"
      class="clickable-table"
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
      fields: ["instances", "name", "key", "tenantId"],
      bcItems: [
        {
          text: "Processes",
          to: "/processes"
        },
        {
          text: "Overview",
          to: "/processes/overview"
        }
      ]
    };
  },
  methods: {
    goToProcessView(item) {
      this.$router.push({ name: "ProcessesDetails", params: { pid: item.id } });
    }
  },
  created() {
    let that = this;
    let baseUrl = process.env.VUE_APP_AJAX_REQUEST_DOMAIN;
    that.$Progress.start();

    axios
      .get(`${baseUrl}/process-definition?latestVersion=true`)
      .then(res => {
        that.processDefinitions = res.data;

        that.processDefinitions.forEach(pp => {
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
              that.$Progress.fail();
              console.error(err);
            });
        });

        that.$Progress.finish();
      })
      .catch(err => {
        that.$Progress.fail();
        console.error(err);
      });
  }
};
</script>

<style>
</style>