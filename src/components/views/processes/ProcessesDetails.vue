<template>
  <b-container fluid>
    <b-row class="pb-2 container-top">
      <create-process-instance @process-started="fetchAllData"></create-process-instance>
      <b-col class="leftDetails pl-2 border" v-show="showLeftDetails">
        <div class="button" v-show="showLeftDetails">
          <b-button variant="outline-light" @click="showLeftDetails = !showLeftDetails">
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
          <b-button variant="outline-light" @click="showLeftDetails = !showLeftDetails">
            <b-icon-chevron-right font-scale="1"></b-icon-chevron-right>
          </b-button>
        </div>
        <div id="diagram-container">
          <bpmn-display
            ref="bpmn"
            :xml="processDefinitionXML"
            @error="handleError"
            @shown="handleShown"
          ></bpmn-display>
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
            >
              <template v-slot:head(action)>
                <b-button variant="success" @click="createProcessInstance">Create</b-button>
              </template>
              <template
                v-slot:cell(startTime)="value"
              >{{value.item.startTime | moment("YYYY/MM/DD HH:mm:ss")}}</template>
              <template v-slot:cell(businessKey)="value">{{value.item.businessKey || "-"}}</template>
              <template v-slot:cell(action)="value">
                <b-button variant="danger" @click="deleteProcessInstance(value.item.id)">Delete</b-button>
              </template>
            </b-table>
          </b-tab>
          <b-tab title="Audit Log">
            <b-table hover striped :items="auditLog" :fields="auditFields">
              <template v-slot:cell(state)="value">
                <b-icon-check-circle font-scale="2" v-if="value.item.endTime !== null"></b-icon-check-circle>
                <b-icon-circle-half font-scale="2" v-else></b-icon-circle-half>
              </template>
              <template
                v-slot:cell(startTime)="value"
              >{{value.item.startTime | moment("YYYY/MM/DD HH:mm:ss")}}</template>
              <template
                v-slot:cell(endTime)="value"
              >{{value.item.endTime | moment("YYYY/MM/DD HH:mm:ss")}}</template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BpmnDisplay from "./BpmnDisplay";
import CreateProcessInstance from "../../modals/CreateProcessInstance";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "ProcessesDetails",
  components: {
    BpmnDisplay,
    CreateProcessInstance
  },
  computed: {
    ...mapGetters(["camundaUrl"]),
    baseUrl: function() {
      return process.env.VUE_APP_AJAX_REQUEST_DOMAIN;
    }
  },
  data() {
    return {
      updateInterval: 500,
      intervalRef: null,
      instanceFields: ["id", "startTime", "businessKey", "action"],
      auditFields: [
        "state",
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
      auditLog: [],
      overlaysArr: []
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
      this.fetchAllData();
    },
    fetchAllData(){
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
              axios.get(
                this.baseUrl + "/process-definition?key=" + res.data.key
              ),
              axios.get(
                this.baseUrl +
                  "/history/process-instance?processDefinitionId=" +
                  res.data.id +
                  "&unfinished=true"
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

          clearInterval(this.intervalRef);
          this.intervalRef = setInterval(() => {
            this.updateDiagram();
          }, this.updateInterval);
       
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
    },
    updateDiagram() {
      axios
        .all([
          axios.get(this.baseUrl + "/history/activity-instance", {
            params: {
              processDefinitionId: this.$route.params.pid,
              unfinished: true
            }
          }),
          axios.get(this.baseUrl + "/history/incident", {
            params: {
              processDefinitionId: this.$route.params.pid,
              open: true
            }
          })
        ])
        .then(
          axios.spread((ais, incidents) => {
            let overlays = this.$refs.bpmn.getOverlays();

            this.overlaysArr.forEach(o => {
              overlays.remove(o);
            });

            //ais
            let activityIdsCount = {};

            ais.data.forEach(val => {
              if (activityIdsCount[val.activityId] === undefined) {
                activityIdsCount[val.activityId] = 0;
              }
              activityIdsCount[val.activityId]++;
            });

            for (let id in activityIdsCount) {
              let oID = overlays.add(id, {
                position: {
                  bottom: 0,
                  left: 0
                },
                html:
                  '<span class="badge badge-pill badge-primary">' +
                  activityIdsCount[id] +
                  "</span>"
              });
              this.overlaysArr.push(oID);
            }

            //incidents
            var incidentIdsCount = {};

            incidents.data.forEach(val => {
              if (incidentIdsCount[val.activityId] === undefined) {
                incidentIdsCount[val.activityId] = 0;
              }
              incidentIdsCount[val.activityId]++;
            });

            for (let id in incidentIdsCount) {
              let oID = overlays.add(id, {
                position: {
                  bottom: 0,
                  left: 30
                },
                html:
                  '<span class="badge badge-pill badge-danger">' +
                  incidentIdsCount[id] +
                  "</span>"
              });
              this.overlaysArr.push(oID);
            }
          })
        )
        .catch(err => {
          console.error(err);
        });
    },
    createProcessInstance() {
      this.$bvModal.show("modal-instance");
    },
    deleteProcessInstance(id) {
      axios
        .delete(this.baseUrl + "/process-instance/" + id)
        .then(res => {
          this.processInstances = this.processInstances.filter(
            pi => pi.id !== id
          );
          this.processDefinition.instances--;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  created() {
      this.fetchAllData();
  },
  destroyed() {
    clearInterval(this.intervalRef);
  }
};
</script>

<style lang=less scoped>
.container-top {
  height: 700px;
}
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