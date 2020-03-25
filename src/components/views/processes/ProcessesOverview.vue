<template>
  <b-container>
    <h2>Deployed</h2>
    <b-table hover striped @row-clicked="goToProcessView" :items="ctrl.groupedprocessDefinitions" :fields="fields"></b-table>
  </b-container>
</template>

<script>
export default {
  name: "ProcessesOverview",
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
      goToProcessView(item) {
        this.$router.push({name: 'ProcessesDetails', params: {id: item.id}});
          //console.log(`${item.id} clicked`);  
      }
  }
};
</script>

<style>
</style>