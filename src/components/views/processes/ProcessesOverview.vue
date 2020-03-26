<template>
  <b-container>
    <h2>Deployed</h2>
    <b-table hover striped @row-clicked="goToProcessView" :items="getProcessDefinitions" :fields="fields">
      <template v-slot:cell(tenantId)="{ value }">
            {{value.tenantId || "-"}}
      </template>
    </b-table>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProcessesOverview",
  computed: mapGetters(["getProcessDefinitions"]),
  data() {
    return {
      fields: ["instances", "name", "key", "tenantId"]
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