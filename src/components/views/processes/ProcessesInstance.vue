<template>
  <b-container fluid>
    <b-breadcrumb :items="bcItems"></b-breadcrumb>
    <b-row class="pb-2 container-top">
      <b-col class="leftDetails pl-2 border" v-show="showLeftDetails">
        <div class="button" v-show="showLeftDetails">
          <b-button variant="outline-light" @click="showLeftDetails = !showLeftDetails">
            <b-icon-chevron-left font-scale="1"></b-icon-chevron-left>
          </b-button>
        </div>
        <b-list-group>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Instance ID:</h5>
            <p class="mb-0">{{processInstance.id || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Business Key:</h5>
            <p class="mb-0">{{processInstance.businessKey || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Version:</h5>
            <p class="mb-0">{{processDefinition.version || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition ID:</h5>
            <p class="mb-0">{{processInstance.processDefinitionId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Key:</h5>
            <p class="mb-0">{{processInstance.processDefinitionKey || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Definition Name:</h5>
            <p class="mb-0">{{processInstance.processDefinitionName || "null"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Tenant ID:</h5>
            <p class="mb-0">{{processInstance.tenantId || "-"}}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">Deployment ID:</h5>
            <p class="mb-0">{{processDefinition.deploymentId || "-"}}</p>
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
          <b-tab title="Audit Log">
            <b-table hover striped :items="auditlog" :fields="auditfields" show-empty>
              <template
                v-slot:cell(startTime)="value"
              >{{value.item.startTime | moment("YYYY/MM/DD HH:mm:ss")}}</template>
              <template
                v-slot:cell(endTime)="value"
              >{{value.item.endTime | moment("YYYY/MM/DD HH:mm:ss")}}</template>
              <template
                v-slot:cell(durationInMillis)="value"
              >{{value.item.durationInMillis | duration('humanize')}}</template>
              <template v-slot:cell(referenceTime)="value">{{value.item.referenceTime || "-"}}</template>
              <template v-slot:empty>No log data available.</template>
            </b-table>
          </b-tab>
          <b-tab title="Variables">
            <b-table hover striped :items="variables" :fields="variablesFields" show-empty>
              <template v-slot:empty>No variables set.</template>
            </b-table>
          </b-tab>
          <b-tab title="Incidents">
            <b-table hover striped :items="incidents" :fields="incidentsFields" show-empty>
              <template
                v-slot:cell(startTime)="value"
              >{{value.item.startTime | moment("YYYY/MM/DD HH:mm:ss")}}</template>
              <template v-slot:empty>No incidents reported.</template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BpmnDisplay from "./BpmnDisplay";
import axios from "axios";

export default {
  name: "ProcessesInstance",
  components: {
    BpmnDisplay
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
          text: "Processes",
          to: "/processes"
        },
        {
          text: "Overview",
          to: "/processes/overview"
        },
        {
          text: "Definition",
          to: `/processes/${this.$route.params.pid}`
        },
        {
          text: "Instance",
          to: `/processes/${this.$route.params.pid}/instance/${this.$route.params.iid}`
        }
      ],
      updateInterval: 500,
      intervalRef: null,
      overlaysArr: [],
      processInstance: {},
      processDefinition: {},
      processDefinitionXML: "",
      showLeftDetails: true,
      auditlog: [],
      auditfields: [
        "activityName",
        "startTime",
        "endTime",
        {
          key: "durationInMillis",
          label: "Duration"
        },
        "referenceTime",
        "activityId"
      ],
      incidents: [],
      incidentsFields: ["message", "startTime", "activityName"],
      variables: [],
      variablesFields: ["name", "value", "type"]
    };
  },
  methods: {
    handleError: function(err) {
      console.error("failed to show diagram", err);
    },
    handleShown: function() {
      console.log("diagram shown");
    },
    fetchLeftDetails(piid, pdid) {
      axios
        .all([
          axios.get(`${this.baseUrl}/history/process-instance/${piid}`),
          axios.get(`${this.baseUrl}/process-definition/${pdid}`)
        ])
        .then(
          axios.spread((pi, pd) => {
            this.processInstance = pi.data;
            this.processDefinition = pd.data;
          })
        )
        .catch(err => {
          console.error(err);
        });
    },
    fetchProcessDefinitionXML(id) {
      axios
        .get(`${this.baseUrl}/process-definition/${id}/xml`)
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
    updateDiagram() {
      axios
        .all([
          axios.get(`${this.baseUrl}/history/activity-instance`, {
            params: {
              processDefinitionId: this.$route.params.pid,
              processInstanceId: this.$route.params.iid,
              unfinished: true
            }
          }),
          axios.get(`${this.baseUrl}/history/incident`, {
            params: {
              processDefinitionId: this.$route.params.pid,
              processInstanceId: this.$route.params.iid,
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
            ais.data.forEach(val => {
              let oID = overlays.add(val.activityId, {
                position: {
                  bottom: 0,
                  left: 0
                },
                html: '<span class="badge badge-pill badge-primary">1</span>'
              });
              this.overlaysArr.push(oID);
            });

            //incidents
            incidents.data.forEach(val => {
              let oID = overlays.add(val.activityId, {
                position: {
                  bottom: 0,
                  left: 30
                },
                html: '<span class="badge badge-pill badge-danger">1</span>'
              });
              this.overlaysArr.push(oID);
            });
          })
        )
        .catch(err => {
          console.error(err);
        });
    },
    fetchTabContent() {
      axios
        .all([
          axios.get(`${this.baseUrl}/history/activity-instance`, {
            params: {
              processDefinitionId: this.$route.params.pid,
              processInstanceId: this.$route.params.iid,
              sortBy: "startTime",
              sortOrder: "asc"
            }
          }),
          axios.get(`${this.baseUrl}/history/incident`, {
            params: {
              processDefinitionId: this.$route.params.pid,
              processInstanceId: this.$route.params.iid,
              open: true //TODO: check if 'open' or 'unfinished'
            }
          }),
          axios.get(`${this.baseUrl}/history/variable-instance`, {
            params: {
              processInstanceId: this.$route.params.iid
            }
          })
        ])
        .then(
          axios.spread((ai, incidents, vi) => {
            this.auditlog = ai.data;
            this.incidents = incidents ? incidents.data : [];
            this.variables = vi.data;

            this.auditlog.forEach(_a => {
              axios
                .get(`${this.baseUrl}/history/variable-instance`, {
                  params: {
                    processInstanceIdIn: this.$route.params.iid,
                    activityInstanceIdIn: _a.id
                  }
                })
                .then(res => {
                  let v = res.data.find(v => v.name == "referenceTime");
                  this.$set(_a, "referenceTime", v ? v.value : null);
                });
            });
          })
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  created() {
    this.fetchLeftDetails(this.$route.params.iid, this.$route.params.pid);
    this.fetchProcessDefinitionXML(this.$route.params.pid);
    this.fetchTabContent();
  },
  destroyed() {
    clearInterval(this.intervalRef);
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