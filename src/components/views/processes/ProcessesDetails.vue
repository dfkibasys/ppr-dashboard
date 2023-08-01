<template>
  <div class="container-fluid">
    <breadcrumb :items="bcItems"></breadcrumb>
    <div class="row pb-2 container-top">
      <create-process-instance @process-started="fetchAllData"></create-process-instance>
      <deletion-warning
        @delete="deleteDeployment"
        :show="showDeleteModal"
        @close="showDeleteModal = false"
      ></deletion-warning>
      <div class="col leftDetails ps-2 border" v-show="showLeftDetails">
        <div class="button" v-show="showLeftDetails">
          <button class="btn btn-outline" type="button" @click="showLeftDetails = !showLeftDetails">
            <i class="bi bi-chevron-left"></i>
          </button>
        </div>
        <ul class="list-group">
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionVersion') }}:</h5>
            <p class="mb-0">
              <select class="form-select" v-model="currentVersionID" @change="versionChange">
                <option v-for="version in versions" :value="version.value" :key="version.value">{{
                  version.text
                }}</option>
              </select>
            </p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.versionTag') }}:</h5>
            <p class="mb-0">{{ processDefinition.versionTag || 'null' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionId') }}:</h5>
            <p class="mb-0">
              <a
                :href="`${camundaUrl}/engine-rest/process-definition/${processDefinition.id}`"
                target="_blank"
                >{{ processDefinition.id || '-' }}</a
              >
            </p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionKey') }}:</h5>
            <p class="mb-0">{{ processDefinition.key || '-' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.definitionName') }}:</h5>
            <p class="mb-0">{{ processDefinition.name || '-' }}</p>
          </li>
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.tenantId') }}:</h5>
            <p class="mb-0">{{ processDefinition.tenantId || 'null' }}</p>
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
          <li class="list-group-item border-0">
            <h5 class="mb-0">{{ $t('process.instancesRunning') }}:</h5>
            <p class="mb-0">{{ processDefinition.instances || '0' }}</p>
          </li>
          <li class="list-group-item border-0">
            <button class="btn btn-danger" type="button" @click="checkForRunningInstances">{{
              $t('process.delete')
            }}</button>
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
    </div>
    <div class="row px-2">
      <div class="col">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a href="#process" class="nav-link active" data-bs-toggle="tab">{{
              $t('process.processInstances')
            }}</a>
          </li>
          <li class="nav-item">
            <a href="#audit" class="nav-link" data-bs-toggle="tab">{{ $t('process.auditLog') }}</a>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="process">
            <table class="table table-striped table-hover clickable-table" id="instance-table">
              <thead>
                <tr>
                  <th scope="col">{{ $t('process.id') }}</th>
                  <th scope="col">{{ $t('process.startTime') }}</th>
                  <th scope="col">{{ $t('process.businessKey') }}</th>
                  <th scope="col"
                    ><button
                      type="button"
                      class="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-instance"
                      >{{ $t('process.create') }}</button
                    ></th
                  >
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="instance in processInstances"
                  :key="instance.id"
                  @click="goToProcessInstance(instance)"
                >
                  <td>{{ instance.id }}</td>
                  <td>{{ moment(instance.startTime) }}</td>
                  <td>{{ instance.businessKey || '-' }}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click.stop="deleteProcessInstance(instance.id)"
                      >{{ $t('process.delete') }}</button
                    ></td
                  >
                </tr>
                <tr v-if="processInstances.length === 0">
                  <td colspan="4">{{ $t('process.emptyProcessInstancesMessage') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="tab-pane fade" id="audit">
            <table class="table table-striped table-hover" id="audit-table">
              <thead>
                <tr>
                  <th scope="col">{{ $t('process.state') }}</th>
                  <th scope="col">{{ $t('process.processInstanceId') }}</th>
                  <th scope="col">{{ $t('process.activityName') }}</th>
                  <th scope="col">{{ $t('process.startTime') }}</th>
                  <th scope="col">{{ $t('process.endTime') }}</th>
                  <th scope="col">{{ $t('process.activityId') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="audit in auditLog" :key="audit.activityId">
                  <td>
                    <i
                      class="bi bi-check-circle"
                      style="font-size: 2rem"
                      v-if="audit.endTime !== null"
                    ></i>
                    <i class="bi bi-circle-half" style="font-size: 2rem" v-else></i>
                  </td>
                  <td>{{ audit.processInstanceId }}</td>
                  <td>{{ audit.activityName }}</td>
                  <td>{{ moment(audit.startTime) }}</td>
                  <td>{{ moment(audit.endTime) }}</td>
                  <td>{{ audit.activityId || '-' }}</td>
                </tr>
                <tr v-if="auditLog.length === 0">
                  <td colspan="6">{{ $t('process.emptyLogDataMessage') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BpmnDisplay from '@/components/views/processes/BpmnDisplay.vue';
import CreateProcessInstance from '@/components/modals/CreateProcessInstance.vue';
import DeletionWarning from '@/components/modals/DeletionWarning.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import getEnv from '@/helpers/env';
import moment from 'moment';
import Breadcrumb from '@/components/common/Breadcrumb.vue';
import {
  auditLog,
  breadcrumbItem,
  processDefinition,
  processInstance,
} from '@/interfaces/IProcesses';

export default defineComponent({
  name: 'ProcessesDetails',
  components: {
    BpmnDisplay,
    CreateProcessInstance,
    DeletionWarning,
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
          active: false,
        },
        {
          text: this.$t('process.breadcrumb.definition'),
          to: `/processes/${this.$route.params.pid}`,
          active: true,
        },
      ] as breadcrumbItem[],
      updateInterval: 500,
      intervalRef: 0,
      showLeftDetails: true,
      currentVersionID: '',
      versions: [] as any, //TODO
      processInstances: [] as processInstance[],
      processDefinition: {} as processDefinition,
      processDefinitionXML: '',
      auditLog: [] as auditLog[],
      overlaysArr: [],
      showDeleteModal: false,
    };
  },
  watch: {
    $route(to, from) {
      // Fetch new data after route change (caused by version change)
      this.fetchAllData();
    },
  },
  methods: {
    moment(date) {
      return moment(date).format(this.$t('process.timeFormat') as any);
    },
    goToProcessInstance(item) {
      this.$router.push({
        name: 'ProcessesInstance',
        params: { pid: this.$route.params.pid, iid: item.id },
      });
    },
    handleError: function (err) {
      console.error('failed to show diagram', err);
    },
    handleShown: function () {
      console.log('diagram shown');
    },
    versionChange() {
      this.$router.push({
        name: 'ProcessesDetails',
        params: { pid: this.currentVersionID },
      });
    },
    checkForRunningInstances() {
      //Show warning if deployment has running instances
      if (this.processDefinition.instances > 0) {
        this.showDeleteModal = true;
      } else {
        this.deleteDeployment();
      }
    },
    deleteDeployment() {
      this.showDeleteModal = false; // Just in case coming from the modal
      let version = this.processDefinition.version;

      axios
        .delete(`${this.baseUrl}/deployment/${this.processDefinition.deploymentId}`)
        .then((res) => {
          delete this.versions[version];
          if (Object.values(this.versions).length > 0) {
            // another deployment version available, switch to it
            let otherVersionId = (Object.values(this.versions)[0] as any).value;
            this.currentVersionID = otherVersionId;
            this.versionChange();
          } else {
            // no more deployments, go back to overview
            this.$router.push({
              name: 'Processes',
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    fetchAllData() {
      this.$Progress.start();

      Promise.all([
        this.fetchLeftDetails(this.$route.params.pid),
        this.fetchTabContent(this.$route.params.pid),
        this.fetchBPMN(this.$route.params.pid),
      ])
        .then(() => {
          this.$Progress.finish();
        })
        .catch((err) => {
          console.error(err);
          this.$Progress.fail();
        });
    },
    fetchLeftDetails(id: string) {
      let that = this;

      const fetchedDetails = function (resolve, reject) {
        axios
          .get(`${that.baseUrl}/process-definition/${id}`)
          .then((res) => {
            that.currentVersionID = res.data.id;
            that.processDefinition = res.data;

            axios
              .all([
                axios.get(`${that.baseUrl}/process-definition?key=${res.data.key}`),
                axios.get(`${that.baseUrl}/process-instance/count?processDefinitionId=${id}`),
              ])
              .then(
                axios.spread((pds, pic) => {
                  //pds
                  that.versions = {};
                  pds.data.forEach((v: any) => {
                    //formatting for b-form-select component 1: { text: '1', value: 'ID' },
                    that.versions[v.version] = {
                      value: v.id,
                      text: v.version,
                    };
                  });

                  //pic
                  that.processDefinition['instances'] = pic.data.count;

                  resolve();
                })
              )
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      };

      return new Promise(fetchedDetails);
    },
    fetchBPMN(id: string) {
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
    fetchTabContent(id: string) {
      let that = this;

      const fetchedTabContent = function (resolve, reject) {
        axios
          .all([
            axios.get(
              `${that.baseUrl}/history/process-instance?processDefinitionId=${id}&unfinished=true`
            ),
            axios.get(`${that.baseUrl}/history/activity-instance`, {
              params: {
                processDefinitionId: id,
                sortBy: 'startTime',
                sortOrder: 'asc',
              },
            }),
          ])
          .then(
            axios.spread((pi, ai) => {
              that.auditLog = ai.data;
              that.processInstances = pi.data;

              resolve();
            })
          )
          .catch((err) => {
            reject(err);
          });
      };

      return new Promise(fetchedTabContent);
    },
    updateDiagram() {
      let that = this;

      axios
        .all([
          axios.get(`${that.baseUrl}/history/activity-instance`, {
            params: {
              processDefinitionId: that.$route.params.pid,
              unfinished: true,
            },
          }),
          axios.get(`${that.baseUrl}/history/incident`, {
            params: {
              processDefinitionId: that.$route.params.pid,
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

            //Activity instances

            //Detection of completed process instances
            //Check if amount of activity instances differs from running instances count
            if (this.processDefinition.instances !== ais.data.length) {
              //Compare and remove missing process instance from table
              const ids = ais.data.map((obj) => obj.processInstanceId);
              this.processInstances = this.processInstances.filter(
                (instance) => ids.indexOf(instance.id) > -1
              );
              this.processDefinition.instances = ais.data.length;
            }

            let activityIdsCount = {} as any;

            ais.data.forEach((val: any) => {
              if (activityIdsCount[val.activityId] === undefined) {
                activityIdsCount[val.activityId] = 0;
              }
              activityIdsCount[val.activityId]++;
            });

            for (let id in activityIdsCount) {
              let oID = overlays.add(id, {
                position: {
                  bottom: 0,
                  left: 0,
                },
                html: `<span class="badge rounded-pill bg-primary">${activityIdsCount[id]}</span>`,
              });
              that.overlaysArr.push(oID);
            }

            //Incidents
            let incidentIdsCount = {} as any;

            incidents.data.forEach((val: any) => {
              if (incidentIdsCount[val.activityId] === undefined) {
                incidentIdsCount[val.activityId] = 0;
              }
              incidentIdsCount[val.activityId]++;
            });

            for (let id in incidentIdsCount) {
              let oID = overlays.add(id, {
                position: {
                  bottom: 0,
                  left: 30,
                },
                html: `<span class="badge rounded-pill bg-danger">${incidentIdsCount[id]}</span>`,
              });
              that.overlaysArr.push(oID);
            }
          })
        )
        .catch((err) => {
          this.$Progress.fail();
          console.error(err);
        });
    },
    createProcessInstance() {
      this.$bvModal.show('modal-instance');
    },
    deleteProcessInstance(id: string) {
      let that = this;

      axios
        .delete(`${that.baseUrl}/process-instance/${id}`)
        .then((res) => {
          that.processInstances = that.processInstances.filter((pi: any) => pi.id !== id);
          that.processDefinition.instances--;
        })
        .catch((err) => {
          this.$Progress.fail();
          console.error(err);
        });
    },
  },
  created() {
    this.fetchAllData();
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
    z-index: 1000;
  }
}
.rightDiagram {
  height: 710px;
  .button {
    position: absolute;
    left: 0px;
    z-index: 1000;
  }
}
</style>
