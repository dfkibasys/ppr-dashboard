<template>
  <b-container fluid>
    <b-breadcrumb :items="bcItems"></b-breadcrumb>
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
            <h5 class="mb-0">{{$t('process.definitionVersion')}}:</h5>
            <p class="mb-0">
              <b-form-select v-model="currentVersionID" :options="versions" @change="versionChange"></b-form-select>
            </p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{$t('process.versionTag')}}:</h5>
            <p class="mb-0">{{processDefinition.versionTag || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{$t('process.definitionId')}}:</h5>
            <p class="mb-0">{{processDefinition.id || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{$t('process.definitionKey')}}:</h5>
            <p class="mb-0">{{processDefinition.key || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{$t('process.definitionName')}}:</h5>
            <p class="mb-0">{{processDefinition.name || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{$t('process.tenantId')}}:</h5>
            <p class="mb-0">{{processDefinition.tenantId || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{$t('process.deploymentId')}}:</h5>
            <p class="mb-0">{{processDefinition.deploymentId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{$t('process.instancesRunning')}}:</h5>
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
          <b-tab :title="$t('process.processInstances')">
            <b-table
              hover
              striped
              @row-clicked="goToProcessInstance"
              :items="processInstances"
              :fields="instanceFields"
              class="clickable-table"
              show-empty
            >
              <template v-slot:head(action)>
                <b-button variant="success" @click="createProcessInstance">{{$t('process.create')}}</b-button>
              </template>
              <template
                v-slot:cell(startTime)="value"
              >{{value.item.startTime | moment("YYYY/MM/DD HH:mm:ss")}}</template>
              <template v-slot:cell(businessKey)="value">{{value.item.businessKey || "-"}}</template>
              <template v-slot:cell(action)="value">
                <b-button variant="danger" @click="deleteProcessInstance(value.item.id)">{{$t('process.delete')}}</b-button>
              </template>
              <template v-slot:empty>No process instances running.</template>
            </b-table>
          </b-tab>
          <b-tab :title="$t('process.auditLog')">
            <b-table hover striped :items="auditLog" :fields="auditFields" show-empty>
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
              <template v-slot:empty>No log data available.</template>
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
import axios from "axios";

export default {
  name: "ProcessesDetails",
  components: {
    BpmnDisplay,
    CreateProcessInstance
  },
  computed: {
    baseUrl: function() {
      return process.env.VUE_APP_AJAX_REQUEST_DOMAIN;
    }
  },
  data() {
    return {
      bcItems: [
        {
          text: this.$t("process.breadcrumb.overview"),
          to: "/processes"
        },
        {
          text: this.$t("process.breadcrumb.definition"),
          to: `/processes/${this.$route.params.pid}`
        }
      ],
      updateInterval: 500,
      intervalRef: null,
      instanceFields: [
        { key: "id", label: this.$t("process.id") },
        { key: "startTime", label: this.$t("process.startTime") },
        { key: "businessKey", label: this.$t("process.businessKey") },
        "action"
      ],
      auditFields: [
        { key: "state", label: this.$t("process.state") },
        { key: "processInstanceId", label: this.$t("process.processInstanceId") },
        { key: "activityName", label: this.$t("process.activityName") },
        { key: "startTime", label: this.$t("process.startTime") },
        { key: "endTime", label: this.$t("process.endTime") },
        { key: "activityId", label: this.$t("process.activityId") }
      ],
      showLeftDetails: true,
      currentVersionID: null,
      versions: {},
      processInstances: [],
      processDefinition: {},
      processDefinitionXML: "",
      auditLog: [],
      overlaysArr: [],
      cbCount: 0 //counts callbacks of api requests for progress bar
    };
  },
  watch: {
    cbCount: function(val) {
      if (val == 3) {
        this.$Progress.finish();
      }
    }
  },
  methods: {
    goToProcessInstance(item) {
      this.$router.push({
        name: "ProcessesInstance",
        params: { pid: this.$route.params.pid, iid: item.id }
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
    fetchAllData() {
      let that = this;
      that.cbCount = 0;
      that.$Progress.start();

      that.fetchLeftDetails(that.$route.params.pid, function() {
        that.cbCount++;
      });
      that.fetchTabContent(that.$route.params.pid, function() {
        that.cbCount++;
      });
      that.fetchBPMN(that.$route.params.pid, function() {
        that.cbCount++;
      });
    },
    fetchLeftDetails(id, callback) {
      let that = this;

      axios
        .get(`${that.baseUrl}/process-definition/${id}`)
        .then(res => {
          that.currentVersionID = res.data.id;
          that.processDefinition = res.data;

          axios
            .all([
              axios.get(
                `${that.baseUrl}/process-definition?key=${res.data.key}`
              ),
              axios.get(
                `${that.baseUrl}/process-instance/count?processDefinitionId=${id}`
              )
            ])
            .then(
              axios.spread((pds, pic) => {
                //pds
                that.versions = {};
                pds.data.forEach(v => {
                  //formatting for b-form-select component 1: { text: '1', value: 'ID' },
                  that.versions[v.version] = {
                    value: v.id,
                    text: v.version
                  };
                });

                //pic
                that.$set(that.processDefinition, "instances", pic.data.count);

                callback();
              })
            )
            .catch(err => {
              that.$Progress.fail();
              console.error(err);
            });
        })
        .catch(err => {
          that.$Progress.fail();
          console.error(err);
        });
    },
    fetchBPMN(id, callback) {
      let that = this;

      axios
        .get(`${that.baseUrl}/process-definition/${id}/xml`)
        .then(res => {
          that.processDefinitionXML = res.data.bpmn20Xml;

          clearInterval(that.intervalRef);
          that.intervalRef = setInterval(() => {
            that.updateDiagram();
          }, that.updateInterval);
          callback();
        })
        .catch(err => {
          that.$Progress.fail();
          console.error(err);
        });
    },
    fetchTabContent(id, callback) {
      let that = this;

      axios
        .all([
          axios.get(
            `${that.baseUrl}/history/process-instance?processDefinitionId=${id}&unfinished=true`
          ),
          axios.get(`${that.baseUrl}/history/activity-instance`, {
            params: {
              processDefinitionId: id,
              sortBy: "startTime",
              sortOrder: "asc"
            }
          })
        ])
        .then(
          axios.spread((pi, ai) => {
            that.auditLog = ai.data;
            that.processInstances = pi.data;

            callback();
          })
        )
        .catch(err => {
          that.$Progress.fail();
          console.error(err);
        });
    },
    updateDiagram() {
      let that = this;

      axios
        .all([
          axios.get(`${that.baseUrl}/history/activity-instance`, {
            params: {
              processDefinitionId: that.$route.params.pid,
              unfinished: true
            }
          }),
          axios.get(`${that.baseUrl}/history/incident`, {
            params: {
              processDefinitionId: that.$route.params.pid,
              open: true
            }
          })
        ])
        .then(
          axios.spread((ais, incidents) => {
            let overlays = that.$refs.bpmn.getOverlays();

            that.overlaysArr.forEach(o => {
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
                html: `<span class="badge badge-pill badge-primary">${activityIdsCount[id]}</span>`
              });
              that.overlaysArr.push(oID);
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
                html: `<span class="badge badge-pill badge-primary">${incidentIdsCount[id]}</span>`
              });
              that.overlaysArr.push(oID);
            }
          })
        )
        .catch(err => {
          that.$Progress.fail();
          console.error(err);
        });
    },
    createProcessInstance() {
      this.$bvModal.show("modal-instance");
    },
    deleteProcessInstance(id) {
      let that = this;

      axios
        .delete(`${that.baseUrl}/process-instance/${id}`)
        .then(res => {
          that.processInstances = that.processInstances.filter(
            pi => pi.id !== id
          );
          that.processDefinition.instances--;
        })
        .catch(err => {
          that.$Progress.fail();
          console.error(err);
        });
    }
  },
  created() {
    this.fetchAllData();
  },
  beforeDestroy() {
    clearInterval(this.intervalRef);
  }
};
</script>

<style lang="scss" scoped>
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