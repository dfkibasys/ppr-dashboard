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
            id: "hoergorgh",
            instances: 6,
            name: "Invoice",
            key: "invoice",
            tenantId: "je"
          },
          {
            id: "hberhe",
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
          console.log(`${item.id} clicked`);  
      }
  }
};
</script>

<style>
</style>