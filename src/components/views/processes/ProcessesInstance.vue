<template>
  <b-container fluid>
    <b-row class="pb-2">
      <b-col class="leftDetails pl-2 border">
        <div class="button" v-show="ctrl.showLeftDetails">
          <b-button variant="light" @click="ctrl.showLeftDetails = !ctrl.showLeftDetails">
            <b-icon-chevron-left font-scale="1"></b-icon-chevron-left>
          </b-button>
        </div>
        <b-list-group>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Instance ID:</h5>
            <p class="mb-0">{{ctrl.processInstance.id || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Business Key:</h5>
            <p class="mb-0">{{ctrl.processInstance.businessKey || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Version:</h5>
            <p class="mb-0">{{ctrl.processDefinition.version || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition ID:</h5>
            <p class="mb-0">{{ctrl.processInstance.processDefinitionId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Key:</h5>
            <p class="mb-0">{{ctrl.processInstance.processDefinitionKey || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Name:</h5>
            <p class="mb-0">{{ctrl.processInstance.processDefinitionName || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Tenant ID:</h5>
            <p class="mb-0">{{ctrl.processInstance.tenantId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Deployment ID:</h5>
            <p class="mb-0">{{ctrl.processDefinition.deploymentId || "-"}}</p>
          </b-list-group-item>
        </b-list-group>
      </b-col>

      <b-col class="border">
        <div v-show="!ctrl.showLeftDetails" style="position: absolute;left: 0px;z-index: 9999;">
          <b-button variant="light" @click="ctrl.showLeftDetails = !ctrl.showLeftDetails">
            <b-icon-chevron-right font-scale="1"></b-icon-chevron-right>
          </b-button>
        </div>
        <div id="diagram-container">
          <vue-bpmn url="data/diagram.bpmn" v-on:error="handleError" v-on:shown="handleShown"></vue-bpmn>
        </div>
      </b-col>
    </b-row>
    <b-row class="px-2">
      <b-col>
        <b-tabs>
          <b-tab title="Audit Log">
            <b-table hover striped :items="ctrl.auditlog" :fields="ctrl.auditfields"></b-table>
          </b-tab>
          <b-tab title="Variables">
            <b-table hover striped :items="ctrl.variables"></b-table>
          </b-tab>
          <b-tab title="Incidents">
            <b-table hover striped :items="ctrl.incidents"></b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueBpmn from "vue-bpmn";

export default {
  name: "ProcessesInstance",
  components: {
    VueBpmn
  },
  data() {
    return {
      ctrl: {
        showLeftDetails: true,
        processInstance: {
          id: "jhgerkg",
          businessKey: "goergoe",
          processDefinitionId: "jhfoger",
          processDefinitionKey: "dlgkjs",
          processDefinitionName: "dogjowed",
          tenantId: "dogijsd"
        },
        processDefinition: {
          version: "foge",
          deploymentId: "ogiwehr"
        },
        auditfields: [
          "activityName",
          "_startTime",
          "_endTime",
          "_duration",
          "_referenceTime",
          "activityId"
        ],
        auditlog: [
          {
            id: "rfeg",
            activityName: "rge",
            _startTime: "roger",
            endTime: "lgej",
            _endTime: "rlgjerp",
            _duration: "grljeprjg",
            _referenceTime: "djgep",
            durationInMillis: "goheoir",
            activityId: "fjgep"
          }
        ],
        variables: [
          {
            id: "fgekp",
            name: "fogpejo",
            value: "gpjero",
            type: "pfgje",
            actions: "-"
          }
        ],
        incidents: [
          {
            id: "pgrjewk",
            incidentMessage: "gpjeor",
            _startTime: "jpeorjgp",
            activityName: "pbje"
          }
        ]
      }
    };
  },
  methods: {
          handleError: function(err) {
      console.error("failed to show diagram", err);
    },
    handleShown: function() {
      console.log("diagram shown");
    }
  }
};
</script>

<style lang=less scoped>
.leftDetails {
  position: relative;
  color: rgba(0, 0, 0, 0.87);
  max-width: 20%;
  .button {
    position: absolute;
    right: 0px;
    z-index: 9999;
  }
}
#diagram-container {
  height: 100%;
}
</style>