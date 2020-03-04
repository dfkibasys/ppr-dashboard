<template>
  <b-modal id="modal-cap" size="lg" title="Capability Overview">
    <div class="modal-body">
      <div id="currentCapability">
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody v-for="(capability, index) in allDevices[openedDeviceIndex].capability" :key="index">
            <tr>
              <th scope="row">{{index}}</th>
              <td>{{capability.name}}</td>
              <td>
                <button
                  type="button"
                  id="remove-btn"
                  class="btn btn-danger"
                  v-if="capability.taught"
                  v-bind:disabled="false"
                  @click="removeCapability(capability)"
                >Remove</button>
                <button
                  type="button"
                  id="teach-btn"
                  class="btn btn-info"
                  v-else
                  v-bind:disabled="true"
                  @click="startTeaching"
                >Teach</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template v-slot:modal-footer="{cancel}">
      <b-button variant="secondary" @click="cancel">{{$t("translation.modal_close")}}</b-button>
    </template>
  </b-modal>
</template>

<script>
import axios from "axios";
import {mapGetters} from "vuex";

export default {
  name: "CapabilityOverview",
  props: {
    openedDeviceIndex: 0,
  },
  computed: mapGetters(["camundaUrl", "allDevices"]),
  methods: {
    removeCapability(capability) {
      let url =
        this.camundaUrl +
        "/services/resourceinstance/" +
        this.allDevices[this.openedDeviceIndex].componentId +
        "/capability/" +
        this.allDevices[this.openedDeviceIndex].capabilityAssertionId +
        "/variant/" +
        capability.id;

      axios.delete(url).then(res => {
        //GUI updates
        //TODO: remove capability from devices in mutations
      });
    },
    startTeaching() {
      let url = this.camundaUrl + "/engine-rest/message";
      const data = {
          messageName : "Process.TeachIn.Prepare",
          businessKey: "cebit2018"
      }

      axios
        .post(url, data)
        .then(res => {
          //worked
        });
    }
  }
};
</script>

<style scoped>
</style>