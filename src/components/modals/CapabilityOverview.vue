<template>
  <b-modal id="modal-cap" size="lg" :title="$t('modal.capabilityOverview.title')">
    <div class="modal-body">
      <div id="currentCapability">
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">{{$t('modal.capabilityOverview.name')}}</th>
              <th scope="col">{{$t('modal.capabilityOverview.status')}}</th>
            </tr>
          </thead>
          <tbody
            v-for="(capability, index) in allDevices[openedDeviceIndex].capability"
            :key="capability.name + capability.taught"
          >
            <tr>
              <th scope="row">{{index}}</th>
              <td>{{capability.name}}</td>
              <td>
                <button
                  type="button"
                  id="remove-btn"
                  class="btn btn-danger"
                  v-if="capability.taught"
                  :disabled="true"
                  @click="removeCapability(capability)"
                >{{$t('modal.capabilityOverview.remove')}}</button>
                <button
                  type="button"
                  id="teach-btn"
                  class="btn btn-info"
                  v-else
                  :disabled="false"
                  @click="startTeaching"
                >{{$t('modal.capabilityOverview.teach')}}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template v-slot:modal-footer="{cancel}">
      <b-button variant="secondary" @click="cancel">{{$t("modal.close")}}</b-button>
    </template>
  </b-modal>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "CapabilityOverview",
  props: {
    openedDeviceIndex: Number
  },
  computed: mapGetters(["basysUrl", "camundaUrl", "allDevices"]),
  methods: {
    removeCapability(capability) {
      let url = `${this.basysUrl}/services/resourceinstance/${
        this.allDevices[this.openedDeviceIndex].componentId
      }/capability/${
        this.allDevices[this.openedDeviceIndex].capabilityAssertionId
      }/variant/${capability.id}`;

      axios.delete(url).then(res => {
        //GUI updates
        //TODO: remove capability from devices in mutations
      });
    },
    startTeaching() {
      let url = this.camundaUrl + "/engine-rest/message";
      const data = {
        messageName: "Process.TeachIn.Prepare",
        businessKey: "cebit2018"
      };

      axios.post(url, data).then(res => {
        //worked
      });
    }
  }
};
</script>

<style scoped>
</style>