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
          <tbody v-for="(capability, index) in currentCapabilities" :key="index">
            <tr>
              <th scope="row">{{index}}</th>
              <td>{{capability.name}}</td>
              <td>
                <button
                  type="button"
                  id="remove-btn"
                  class="btn btn-danger"
                  v-if="capability.taught"
                  v-bind:disabled="true"
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

export default {
  name: "CapabilityOverview",
  props: {
    openedDevice: Object,
    currentCapabilities: Array
  },
  methods: {
    removeCapability(capability) {
      let url =
        this.$store.state.CAMUNDA_REST_URL +
        "/services/resourceinstance/" +
        this.openedDevice.componentId +
        "/capability/" +
        this.openedDevice.capabilityAssertionId +
        "/variant/" +
        capability.id;

      axios.delete(url).then(res => {
        //GUI updates
        //TODO: remove capability from devices
      });
    },
    startTeaching() {
      let url = this.$store.state.CAMUNDA_REST_URL + "/engine-rest/message";
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