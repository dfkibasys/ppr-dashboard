<template>
  <b-container>
    <h2>Deployed</h2>
    <b-table hover striped @row-clicked="goToProcessView" :items="getProcessDefinitions" :fields="fields"></b-table>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProcessesOverview",
  computed: mapGetters(["getProcessDefinitions"]),
  data() {
    return {
      fields: ["instances", "name", "key", "tenantId"],
      ctrl: {
        groupedprocessDefinitions: [
          {
            id: "id-1",
            instances: 6,
            name: "Invoice",
            key: "invoice",
            tenantId: "je"
          },
          {
            id: "id-2",
            instances: 2,
            name: "Review",
            key: "review",
            tenantId: "-"
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions(["fetchProcessDefinitions"]),
      goToProcessView(item) {
        this.$router.push({name: 'ProcessesDetails', params: {pid: item.id}});
          //console.log(`${item.id} clicked`);  
      }
  },
  created(){
    this.fetchProcessDefinitions();
  }
};
</script>

<style>
</style>