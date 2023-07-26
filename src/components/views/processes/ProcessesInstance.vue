<template>
  <b-container fluid>
    <b-breadcrumb :items="bcItems"></b-breadcrumb>
    <b-row class="pb-2 container-top">
      <b-col class="leftDetails pl-2 border" v-show="showLeftDetails">
        <div class="button" v-show="showLeftDetails">
          <b-button variant="outline-light" @click="showLeftDetails = !showLeftDetails">
            <b-icon-chevron-left font-scale="1" variant="secondary"></b-icon-chevron-left>
          </b-button>
        </div>
        <b-list-group>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.instanceId') }}:</h5>
            <p class="mb-0">
              <b-link
                :href="`${camundaUrl}/engine-rest/process-instance/${processInstance.id}`"
                target="_blank"
                >{{ processInstance.id || '-' }}</b-link
              >
            </p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.businessKey') }}:</h5>
            <p class="mb-0">{{ processInstance.businessKey || 'null' }}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.definitionVersion') }}:</h5>
            <p class="mb-0">{{ processDefinition.version || 'null' }}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.definitionId') }}:</h5>
            <p class="mb-0">
              <b-link
                :href="`${camundaUrl}/engine-rest/process-definition/${processInstance.processDefinitionId}`"
                target="_blank"
                >{{ processInstance.processDefinitionId || '-' }}</b-link
              >
            </p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.definitionKey') }}:</h5>
            <p class="mb-0">{{ processInstance.processDefinitionKey || '-' }}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.definitionName') }}:</h5>
            <p class="mb-0">{{ processInstance.processDefinitionName || 'null' }}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.tenantId') }}:</h5>
            <p class="mb-0">{{ processInstance.tenantId || '-' }}</p>
          </b-list-group-item>
          <b-list-group-item class="border-0">
            <h5 class="mb-0">{{ $t('process.deploymentId') }}:</h5>
            <p class="mb-0">
              <b-link
                :href="`${camundaUrl}/engine-rest/deployment/${processDefinition.deploymentId}`"
                target="_blank"
                >{{ processDefinition.deploymentId || '-' }}</b-link
              >
            </p>
          </b-list-group-item>
        </b-list-group>
      </b-col>

      <b-col class="rightDiagram border">
        <div class="button" v-show="!showLeftDetails">
          <b-button variant="outline-light" @click="showLeftDetails = !showLeftDetails">
            <b-icon-chevron-right font-scale="1" variant="secondary"></b-icon-chevron-right>
          </b-button>
        </div>
        <div id="diagram-container" class="h-100">
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
          <b-tab :title="$t('process.auditLog')">
            <b-table hover striped :items="auditLog" :fields="auditFields" show-empty>
              <template v-slot:head(activityName)>{{ $t('process.activityName') }}</template>
              <template v-slot:head(startTime)>{{ $t('process.startTime') }}</template>
              <template v-slot:head(endTime)>{{ $t('process.endTime') }}</template>
              <template v-slot:head(durationInMillis)>{{ $t('process.duration') }}</template>
              <template v-slot:head(referenceTime)>{{ $t('process.referenceTime') }}</template>
              <template v-slot:head(activityId)>{{ $t('process.activityId') }}</template>
              <template v-slot:cell(startTime)="value">{{ moment(value.item.startTime) }}</template>
              <template v-slot:cell(endTime)="value">{{ moment(value.item.endTime) }}</template>
              <template v-slot:cell(durationInMillis)="value">{{
                duration(value.item.durationInMillis)
              }}</template>
              <template v-slot:cell(referenceTime)="value">{{
                value.item.referenceTime || '-'
              }}</template>
              <template v-slot:empty>{{ $t('process.emptyLogDataMessage') }}</template>
            </b-table>
          </b-tab>
          <b-tab :title="$t('process.variables')">
            <b-table hover striped :items="variables" :fields="variablesFields" show-empty>
              <template v-slot:empty>{{ $t('process.emptyVariablesMessage') }}</template>
              <template v-slot:head(name)>{{ $t('process.name') }}</template>
              <template v-slot:head(value)>{{ $t('process.value') }}</template>
              <template v-slot:head(type)>{{ $t('process.type') }}</template>
            </b-table>
          </b-tab>
          <b-tab :title="$t('process.incidents')">
            <b-table hover striped :items="incidents" :fields="incidentsFields" show-empty>
              <template v-slot:head(message)>{{ $t('process.message') }}</template>
              <template v-slot:head(startTime)>{{ $t('process.startTime') }}</template>
              <template v-slot:head(activityName)>{{ $t('process.activityName') }}</template>
              <template v-slot:cell(startTime)="value">{{ moment(value.item.startTime) }}</template>
              <template v-slot:empty>{{ $t('process.emptyIncidentsMessage') }}</template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BpmnDisplay from '@/components/views/processes/BpmnDisplay.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IProcessesInstance';
import getEnv from '@/helpers/env';
import moment from 'moment';

export default defineComponent({
  name: 'ProcessesInstance',
  components: {
    BpmnDisplay,
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
      auditFields: [
        'activityName',
        'startTime',
        'endTime',
        'durationInMillis',
        'referenceTime',
        'activityId',
      ],
      variables: [],
      variablesFields: ['name', 'value', 'type'],
      incidents: [],
      incidentsFields: ['message', 'startTime', 'activityName'],
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

            //ais
            ais.data.forEach((val: any) => {
              let oID = overlays.add(val.activityId, {
                position: {
                  bottom: 0,
                  left: 0,
                },
                html: '<span class="badge badge-pill badge-primary">1</span>',
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
                html: '<span class="badge badge-pill badge-danger">1</span>',
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
