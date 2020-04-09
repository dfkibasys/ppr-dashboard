<template>
  <div>
    <div class="cardContainer" id="deviceContainer">
      <div class="card" v-for="(device, index) in allDevices" :key="device.componentId">
        <div class="card-header">
          <h5 class="card-title">{{device.componentName}}</h5>
          <b-button
            @click="openPackML(index)"
            class="btn btn-info float-right"
            data-bind="attr: { 'data-state': currentState, 'data-index': $index }"
          >{{device.currentMode}} - {{device.currentState}}</b-button>
        </div>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <div class="col-4 image">
                <img :src="require('@/assets/' + device.type + '.png')" />
              </div>
              <div class="col-3">
                {{$t("card.type")}}:
                <br />
                {{$t("card.location")}}:
                <br />
                {{$t("card.serial")}}:
                <br />
                {{$t("card.capability")}}:
                <br />
              </div>
              <div class="col-5 properties">
                <a target="_blank" :href="device.docuLink">{{device.type}}</a>
                <br />
                {{device.location}}
                <br />
                {{device.serial}}
                <br />
                {{device.capability.length-1}}
                <a
                  href="#"
                  @click="openCapabilityOverview(index)"
                >({{$t("card.show")}})</a>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <PackML :opened-device-index="openedIndex"></PackML>
    <CapabilityOverview :opened-device-index="openedIndex"></CapabilityOverview>
  </div>
</template>

<script>
import PackML from "../modals/PackML";
import CapabilityOverview from "../modals/CapabilityOverview";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Devices",
  components: {
    PackML,
    CapabilityOverview
  },
  computed: mapGetters(["allDevices"]),
  data() {
    return {
      openedIndex: 0
    };
  },
  methods: {
    ...mapActions(["fetchDevices"]),
    openPackML: function(index) {
      this.openedIndex = index;
      this.$bvModal.show("modal-pack");
    },
    openCapabilityOverview: function(index) {
      this.openedIndex = index;
      this.$bvModal.show("modal-cap");
    }
  },
  created() {
    let that = this;
    this.fetchDevices();

    this.$mqtt.subscribe("hybrit/devices");

    this.$mqtt.on((topic, message) => {
      let msg = JSON.parse(message.toString());
      console.log(`Message arrived on topic ${topic}, msg: ${msg}`);
      this.$store.commit("updateDevices", msg);
    });
  }
};
</script>

<style lang="less" scoped>
h5 {
  width: 50%;
  float: left;
}
</style>