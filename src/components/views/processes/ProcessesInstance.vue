<template>
  <div class="container-fluid">
    <breadcrumb :items="bcItems"></breadcrumb>
    <div class="row pb-2 container-top">
      <div class="col leftDetails ps-2 border" v-show="showLeftDetails">
        <div class="button" v-show="showLeftDetails">
          <button class="btn btn-outline" type="button" @click="showLeftDetails = !showLeftDetails">
            <i class="bi bi-chevron-left"></i>
          </button>
        </div>
        <ul class="list-group">
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.instanceId') }}:</h5>
            <p class="mb-0">
              <a
                :href="`${camundaUrl}/engine-rest/process-instance/${processInstance.id}`"
                target="_blank"
                >{{ processInstance.id || '-' }}</a
              >
            </p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.businessKey') }}:</h5>
            <p class="mb-0">{{ processInstance.businessKey || 'null' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionVersion') }}:</h5>
            <p class="mb-0">{{ processDefinition.version || 'null' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionId') }}:</h5>
            <p class="mb-0">
              <a
                :href="`${camundaUrl}/engine-rest/process-definition/${processInstance.processDefinitionId}`"
                target="_blank"
                >{{ processInstance.processDefinitionId || '-' }}</a
              >
            </p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionKey') }}:</h5>
            <p class="mb-0">{{ processInstance.processDefinitionKey || '-' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionName') }}:</h5>
            <p class="mb-0">{{ processInstance.processDefinitionName || 'null' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.tenantId') }}:</h5>
            <p class="mb-0">{{ processInstance.tenantId || '-' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.deploymentId') }}:</h5>
            <p class="mb-0">
              <a
                :href="`${camundaUrl}/engine-rest/deployment/${processDefinition.deploymentId}`"
                target="_blank"
                >{{ processDefinition.deploymentId || '-' }}</a
              >
            </p>
          </li>
        </ul>
      </div>

      <div class="col rightDiagram border">
        <div class="button" v-show="!showLeftDetails">
          <button class="btn btn-outline" type="button" @click="showLeftDetails = !showLeftDetails">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
        <div id="diagram-container" class="h-100">
          <bpmn-display
            ref="bpmn"
            :xml="processDefinitionXML"
            @error="handleError"
            @shown="handleShown"
          ></bpmn-display>
        </div>
      </div>
      <div class="row px-2">
        <div class="col">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a href="#auditLog" class="nav-link active" data-bs-toggle="tab">{{
                $t('process.auditLog')
              }}</a>
            </li>
            <li class="nav-item">
              <a href="#variables" class="nav-link" data-bs-toggle="tab">{{
                $t('process.variables')
              }}</a>
            </li>
            <li class="nav-item">
              <a href="#incidents" class="nav-link" data-bs-toggle="tab">{{
                $t('process.incidents')
              }}</a>
            </li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane fade show active" id="auditLog">
              <table class="table table-striped table-hover" id="audit-table">
                <thead>
                  <tr>
                    <th scope="col">{{ $t('process.activityName') }}</th>
                    <th scope="col">{{ $t('process.startTime') }}</th>
                    <th scope="col">{{ $t('process.endTime') }}</th>
                    <th scope="col">{{ $t('process.duration') }}</th>
                    <th scope="col">{{ $t('process.referenceTime') }}</th>
                    <th scope="col">{{ $t('process.activityId') }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="audit in auditLog" :key="audit.activityId">
                    <td>{{ audit.activityName }}</td>
                    <td>{{ moment(audit.startTime) }}</td>
                    <td>{{ moment(audit.endTime) }}</td>
                    <td>{{ duration(audit.durationInMillis) }}</td>
                    <td>{{ audit.referenceTime || '-' }}</td>
                    <td>{{ audit.activityId || '-' }}</td>
                  </tr>
                  <tr v-if="auditLog.length === 0">
                    <td colspan="6">{{ $t('process.emptyLogDataMessage') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tab-pane fade" id="variables">
              <table class="table table-striped table-hover" id="variables-table">
                <thead>
                  <tr>
                    <th scope="col">{{ $t('process.name') }}</th>
                    <th scope="col">{{ $t('process.value') }}</th>
                    <th scope="col">{{ $t('process.type') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="variable in variables" :key="variable.name">
                    <td>{{ variable.name }}</td>
                    <td>{{ variable.value || '-' }}</td>
                    <td>{{ variable.type || '-' }}</td>
                  </tr>
                  <tr v-if="variables.length === 0">
                    <td colspan="3">{{ $t('process.emptyVariablesMessage') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tab-pane fade" id="incidents">
              <table class="table table-striped table-hover" id="incidents-table">
                <thead>
                  <tr>
                    <th scope="col">{{ $t('process.message') }}</th>
                    <th scope="col">{{ $t('process.startTime') }}</th>
                    <th scope="col">{{ $t('process.activityName') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="incident in incidents" :key="incident.name">
                    <td>{{ variable.message }}</td>
                    <td>{{ moment(variable.startTime) }}</td>
                    <td>{{ variable.activityName }}</td>
                  </tr>
                  <tr v-if="incidents.length === 0">
                    <td colspan="3">{{ $t('process.emptyIncidentsMessage') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BpmnDisplay from '@/components/views/processes/BpmnDisplay.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IProcessesInstance';
import getEnv from '@/helpers/env';
import moment from 'moment';
import Breadcrumb from '@/components/common/Breadcrumb.vue';

export default defineComponent({
  name: 'ProcessesInstance',
  components: {
    BpmnDisplay,
    Breadcrumb,
  },
  computed: {
    ...mapGetters('endpoints', {
      camundaUrl: 'camundaUrl',
    }),
    baseUrl: function () {
      return getEnv('VITE_AJAX_REQUEST_DOMAIN');
    },
  },
  data() {
    return {
      bcItems: [
        {
          text: this.$t('process.breadcrumb.overview'),
          to: '/processes',
        },
        {
          text: this.$t('process.breadcrumb.definition'),
          to: `/processes/${this.$route.params.pid}`,
        },
        {
          text: this.$t('process.breadcrumb.instance'),
          to: `/processes/${this.$route.params.pid}/instance/${this.$route.params.iid}`,
        },
      ],
      updateInterval: 500,
      intervalRef: 0,
      overlaysArr: [],
      processInstance: {},
      processDefinition: {},
      processDefinitionXML: '',
      showLeftDetails: true,
      auditLog: [],
      variables: [],
      incidents: [],
    };
  },
  methods: {
    moment(date) {
      return moment(date).format(this.$t('process.timeFormat') as any);
    },
    duration(val) {
      return moment.duration(val, 'milliseconds').humanize();
    },
    handleError: function (err) {
      console.error('failed to show diagram', err);
    },
    handleShown: function () {
      console.log('diagram shown');
    },
    fetchLeftDetails(piid, pdid) {
      let that = this;

      const fetchedDetails = function (resolve, reject) {
        axios
          .all([
            axios.get(`${that.baseUrl}/history/process-instance/${piid}`),
            axios.get(`${that.baseUrl}/process-definition/${pdid}`),
          ])
          .then(
            axios.spread((pi, pd) => {
              that.processInstance = pi.data;
              that.processDefinition = pd.data;

              resolve();
            })
          )
          .catch((err) => {
            reject(err);
          });
      };
      return new Promise(fetchedDetails);
    },
    fetchBPMN(id) {
      let that = this;

      const fetchedBPMN = function (resolve, reject) {
        axios
          .get(`${that.baseUrl}/process-definition/${id}/xml`)
          .then((res) => {
            that.processDefinitionXML = res.data.bpmn20Xml;

            clearInterval(that.intervalRef);
            that.intervalRef = window.setInterval(() => {
              that.updateDiagram();
            }, that.updateInterval);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      };
      return new Promise(fetchedBPMN);
    },
    updateDiagram() {
      let that = this;

      axios
        .all([
          axios.get(`${that.baseUrl}/history/activity-instance`, {
            params: {
              processDefinitionId: that.$route.params.pid,
              processInstanceId: that.$route.params.iid,
              unfinished: true,
            },
          }),
          axios.get(`${that.baseUrl}/history/incident`, {
            params: {
              processDefinitionId: that.$route.params.pid,
              processInstanceId: that.$route.params.iid,
              open: true,
            },
          }),
        ])
        .then(
          axios.spread((ais, incidents) => {
            let overlays = (that.$refs.bpmn as any).getOverlays();

            that.overlaysArr.forEach((o: any) => {
              overlays.remove(o);
            });

            //Clear after usage
            that.overlaysArr = [];

            //ais
            ais.data.forEach((val: any) => {
              let oID = overlays.add(val.activityId, {
                position: {
                  bottom: 0,
                  left: 0,
                },
                html: '<span class="badge rounded-pill bg-primary">1</span>',
              });
              that.overlaysArr.push(oID);
            });

            //incidents
            incidents.data.forEach((val: any) => {
              let oID = overlays.add(val.activityId, {
                position: {
                  bottom: 0,
                  left: 30,
                },
                html: '<span class="badge rounded-pill bg-danger">1</span>',
              });
              that.overlaysArr.push(oID);
            });
          })
        )
        .catch((err) => {
          //this.$Progress.fail();
          console.error(err);
        });
    },
    fetchTabContent() {
      let that = this;

      const fetchedTabContent = function (resolve, reject) {
        axios
          .all([
            axios.get(`${that.baseUrl}/history/activity-instance`, {
              params: {
                processDefinitionId: that.$route.params.pid,
                processInstanceId: that.$route.params.iid,
                sortBy: 'startTime',
                sortOrder: 'asc',
              },
            }),
            axios.get(`${that.baseUrl}/history/incident`, {
              params: {
                processDefinitionId: that.$route.params.pid,
                processInstanceId: that.$route.params.iid,
                open: true,
              },
            }),
            axios.get(`${that.baseUrl}/history/variable-instance`, {
              params: {
                processInstanceId: that.$route.params.iid,
              },
            }),
          ])
          .then(
            axios.spread((ai, incidents, vi) => {
              that.auditLog = ai.data;
              that.incidents = incidents ? incidents.data : [];
              that.variables = vi.data;

              that.auditLog.forEach((_a: any) => {
                axios
                  .get(`${that.baseUrl}/history/variable-instance`, {
                    params: {
                      processInstanceIdIn: that.$route.params.iid,
                      activityInstanceIdIn: _a.id,
                    },
                  })
                  .then((res) => {
                    let v = res.data.find((v: any) => v.name == 'referenceTime');
                    _a['referenceTime'] = v ? v.value : null;
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
              resolve();
            })
          )
          .catch((err) => {
            reject(err);
          });
      };
      return new Promise(fetchedTabContent);
    },
  },
  created() {
    //this.$Progress.start();

    Promise.all([
      this.fetchLeftDetails(this.$route.params.iid, this.$route.params.pid),
      this.fetchBPMN(this.$route.params.pid),
      this.fetchTabContent(),
    ])
      .then(() => {
        //this.$Progress.finish();
      })
      .catch((err) => {
        console.error(err);
        //this.$Progress.fail();
      });
  },
  beforeUnmount() {
    clearInterval(this.intervalRef);
  },
});
</script>

<style lang="scss" scoped>
.leftDetails {
  position: relative;
  flex: 0 0 350px;
  .button {
    position: absolute;
    right: 0px;
    z-index: 9999;
  }
}
.rightDiagram {
  height: 650px;
  .button {
    position: absolute;
    left: 0px;
    z-index: 9999;
  }
}
</style>
