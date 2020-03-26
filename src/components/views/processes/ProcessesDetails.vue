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
            <h5 class="mb-0">Definition Version:</h5>
            <p class="mb-0">
              <b-form-select v-model="ctrl.currentVersionID" :options="ctrl.versions"></b-form-select>
            </p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Version Tag:</h5>
            <p class="mb-0">{{ctrl.processDefinition.versionTag || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition ID:</h5>
            <p class="mb-0">{{ctrl.processDefinition.id || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Key:</h5>
            <p class="mb-0">{{ctrl.processDefinition.key || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Name:</h5>
            <p class="mb-0">{{ctrl.processDefinition.name || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Tenant ID:</h5>
            <p class="mb-0">{{ctrl.processDefinition.tenantId || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Deployment ID:</h5>
            <p class="mb-0">{{ctrl.processDefinition.deploymentId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Instances Running:</h5>
            <p class="mb-0">{{ctrl.processDefinition.instances || "0"}}</p>
          </b-list-group-item>
        </b-list-group>
      </b-col>

      <b-col class="border">
        <div v-show="!ctrl.showLeftDetails" style="position: absolute;left: 0px;z-index: 9999;">
          <b-button variant="light" @click="ctrl.showLeftDetails = !ctrl.showLeftDetails">
            <b-icon-chevron-right font-scale="1"></b-icon-chevron-right>
          </b-button>
        </div>
        <div id="diagram-container" >
          <vue-bpmn url="data/diagram.bpmn" v-on:error="handleError" v-on:shown="handleShown"></vue-bpmn>
        </div>
      </b-col>
    </b-row>
    <b-row class="px-2">
      <b-col>
        <b-tabs>
          <b-tab title="Process Instances">
            <b-table
              hover
              striped
              @row-clicked="goToProcessInstance"
              :items="ctrl.processInstances"
            ></b-table>
          </b-tab>
          <b-tab title="Audit Log">
            <b-table hover striped :items="ctrl.auditlog"></b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueBpmn from "vue-bpmn";

export default {
  name: "ProcessesDetails",
  components: {
    VueBpmn
  },
  data() {
    return {
      ctrl: {
        showLeftDetails: true,
        currentVersionID: 1,
        versions: [1, 2],
        processDefinition: {
          versionTag: "V2.0",
          id: "id-1",
          key: "invoice",
          name: "Invoice",
          tenantId: "null",
          deploymentId: "ergrw",
          instances: 6
        },
        processInstances: [
          {
            id: "dsdf",
            startTime: "4545",
            businessKey: "hkgejrg"
          }
        ],
        auditlog: [
          {
            processInstanceId: "gergerg",
            activityName: "fhrthr",
            _startTime: "2020-03-17T07:49:21.783+0000",
            endTime: "gregreh",
            _endTime: "dgerg",
            activityId: "dgerg"
          }
        ]
      }
    };
  },
  methods: {
    goToProcessInstance() {
        this.$router.push({name: 'ProcessesInstance', params: {pid: this.$route.params.pid, iid: "545"}});
    },
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