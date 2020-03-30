<template>
  <b-container fluid>
    <b-row class="pb-2">
      <b-col class="leftDetails pl-2 border">
        <div class="button" v-show="showLeftDetails">
          <b-button variant="light" @click="showLeftDetails = !showLeftDetails">
            <b-icon-chevron-left font-scale="1"></b-icon-chevron-left>
          </b-button>
        </div>
        <b-list-group>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Version:</h5>
            <p class="mb-0">
              <b-form-select
                v-model="currentVersionID"
                :options="getVersions"
                @change="versionChange"
              ></b-form-select>
            </p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Version Tag:</h5>
            <p class="mb-0">{{getProcessDefinitionById.versionTag || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition ID:</h5>
            <p class="mb-0">{{getProcessDefinitionById.id || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Key:</h5>
            <p class="mb-0">{{getProcessDefinitionById.key || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Name:</h5>
            <p class="mb-0">{{getProcessDefinitionById.name || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Tenant ID:</h5>
            <p class="mb-0">{{getProcessDefinitionById.tenantId || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Deployment ID:</h5>
            <p class="mb-0">{{getProcessDefinitionById.deploymentId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Instances Running:</h5>
            <p class="mb-0">{{getProcessDefinitionById.instances || "0"}}</p>
          </b-list-group-item>
        </b-list-group>
      </b-col>

      <b-col class="border">
        <div v-show="!showLeftDetails" style="position: absolute;left: 0px;z-index: 9999;">
          <b-button variant="light" @click="showLeftDetails = !showLeftDetails">
            <b-icon-chevron-right font-scale="1"></b-icon-chevron-right>
          </b-button>
        </div>
        <div id="diagram-container">
          <bpmn-display :xml="getProcessDefinitionXML" @error="handleError" @shown="handleShown"></bpmn-display>
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
              :items="getProcessInstances"
              :fields="instanceFields"
            ></b-table>
          </b-tab>
          <b-tab title="Audit Log">
            <b-table hover striped :items="getAuditLog" :fields="auditFields"></b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BpmnDisplay from "./BpmnDisplay";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProcessesDetails",
  components: {
    BpmnDisplay
  },
  computed: {
    ...mapGetters([
      "getProcessDefinitionById",
      "getProcessInstances",
      "getAuditLog",
      "getProcessDefinitionXML",
      "getVersions"
    ]),
    currentVersionID: {
      get() {
        return this.$store.getters.getCurrentVersionID;
      },
      set(value) {
        this.$store.commit("setCurrentVersionID", value);
      }
    }
  },
  data() {
    return {
      instanceFields: ["id", "businessKey"],
      auditFields: [
        "processInstanceId",
        "activityName",
        "startTime",
        "endTime",
        "activityId"
      ],
      showLeftDetails: true
    };
  },
  methods: {
    ...mapActions([
      "fetchProcessDefinitionById",
      "fetchActivityInstance",
      "fetchProcessDefinitionXML"
    ]),
    goToProcessInstance() {
      this.$router.push({
        name: "ProcessesInstance",
        params: { pid: this.$route.params.pid, iid: "545" }
      });
    },
    handleError: function(err) {
      console.error("failed to show diagram", err);
    },
    handleShown: function() {
      console.log("diagram shown");
    },
    versionChange() {
      this.$router.push({
        name: "ProcessesDetails",
        params: { pid: this.currentVersionID }
      });
      this.fetchProcessDefinitionById(this.$route.params.pid);
      this.fetchActivityInstance(this.$route.params.pid);
      this.fetchProcessDefinitionXML(this.$route.params.pid);
    }
  },
  created() {
    this.fetchProcessDefinitionById(this.$route.params.pid);
    this.fetchActivityInstance(this.$route.params.pid);
    this.fetchProcessDefinitionXML(this.$route.params.pid);
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