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
              <b-form-select v-model="currentVersionID" :options="versions" @change="versionChange"></b-form-select>
            </p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Version Tag:</h5>
            <p class="mb-0">{{processDefinition.versionTag || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition ID:</h5>
            <p class="mb-0">{{processDefinition.id || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Key:</h5>
            <p class="mb-0">{{processDefinition.key || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Name:</h5>
            <p class="mb-0">{{processDefinition.name || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Tenant ID:</h5>
            <p class="mb-0">{{processDefinition.tenantId || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Deployment ID:</h5>
            <p class="mb-0">{{processDefinition.deploymentId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Instances Running:</h5>
            <p class="mb-0">{{processDefinition.instances || "0"}}</p>
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
          <bpmn-display :xml="processDefinitionXML" @error="handleError" @shown="handleShown"></bpmn-display>
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
              :items="processInstances"
              :fields="instanceFields"
            ></b-table>
          </b-tab>
          <b-tab title="Audit Log">
            <b-table hover striped :items="auditLog" :fields="auditFields"></b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BpmnDisplay from "./BpmnDisplay";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "ProcessesDetails",
  components: {
    BpmnDisplay
  },
  computed: {
    ...mapGetters(["camundaUrl"]),
    baseUrl: function() {
      return this.camundaUrl + "/engine-rest";
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
      showLeftDetails: true,
      currentVersionID: null,
      versions: [],
      processInstances: [],
      processDefinition: {},
      processDefinitionXML: "",
      auditLog: []
    };
  },
  methods: {
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
    },
    fetchProcessDefinitionById(id) {

      axios
        .get(this.baseUrl + "/process-definition/" + id)
        .then(res => {
          this.currentVersionID = res.data.id;
          this.processDefinition = res.data;

          axios
            .all([
              axios.get(this.baseUrl + "/process-definition?key=" + res.data.key),
              axios.get(
                this.baseUrl + "/process-instance?processDefinitionId=" + res.data.id
              ),
              axios.get(
                this.baseUrl +
                  "/process-instance/count?processDefinitionId=" +
                  res.data.id
              )
            ])
            .then(
              axios.spread((pds, pis, pic) => {
                //pds
                this.versions = [];
                pds.data.forEach(val => {
                  //formatting for b-form-select component
                  this.versions.push({ value: val.id, text: val.version });
                });

                //pis
                this.processInstances = pis.data;

                //pic
                this.$set(this.processDefinition, "instances", pic.data.count);
              })
            )
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.error(err);
        });
    },
    fetchProcessDefinitionXML(id) {
      axios
        .get(this.baseUrl + "/process-definition/" + id + "/xml")
        .then(res => {
          this.processDefinitionXML = res.data.bpmn20Xml;
        })
        .catch(err => {
          console.error(err);
        });
    },
    fetchActivityInstance(id) {
      axios
        .get(this.baseUrl + "/history/activity-instance", {
          params: {
            processDefinitionId: id,
            sortBy: "startTime",
            sortOrder: "asc"
          }
        })
        .then(res => {
          this.auditLog = res.data;
        })
        .catch(err => {
          console.error(err);
        });
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