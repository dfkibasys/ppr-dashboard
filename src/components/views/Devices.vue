<template>
  <div>
    <div class="cardContainer" id="deviceContainer">
      <div class="card" v-for="(assetId, index) in sortedAssetsList" :key="assetsList[index]">
        <div class="card-header">
          <h5 class="card-title">{{ allAssets[assetId].idShort }}</h5>
          <b-button
            v-if="allAssets[assetId].EXMODE"
            @click="openPackML(assetId)"
            class="btn btn-info float-right"
            >{{ allAssets[assetId].EXMODE }} - {{ allAssets[assetId].EXST }}</b-button
          >
        </div>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <div class="col-4 image">
                <img :src="allAssets[assetId].TypThumbnail" />
              </div>
              <div class="col-3">
                {{ $t('card.type') }}:
                <br />
                {{ $t('card.manufacturer') }}:
                <br />
                {{ $t('card.serial') }}:
                <br />
              </div>
              <div class="col-5 properties">
                <a target="_blank" :href="allAssets[assetId].Documentation">{{
                  allAssets[assetId].ManufacturerProductDesignation
                }}</a>
                <br />
                {{ allAssets[assetId].ManufacturerName }}
                <br />
                {{ allAssets[assetId].SerialNumber }}
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <PackML :opened-asset-id="openedAssetId"></PackML>
    <!-- <CapabilityOverview :opened-device-index="openedIndex"></CapabilityOverview> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PackML from '@/components/modals/PackML.vue';
import CapabilityOverview from '@/components/modals/CapabilityOverview.vue';
import { mapGetters, mapActions } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IDevices';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'Devices',
  components: {
    PackML,
    CapabilityOverview,
  },
  computed: {
    ...mapGetters(['allAssets', 'assetsList']),
    sortedAssetsList: function() {
      let that = this;

      function compare(a, b) {
        if (that.allAssets[a].EXST !== undefined) {
          return -1;
        }
        if (that.allAssets[b].EXST !== undefined) {
          return 1;
        }
        return 0;
      }

      return this.assetsList.sort(compare);
    },
  },
  data() {
    return {
      openedIndex: 0,
      openedAssetId: '',
    };
  },
  methods: {
    ...mapActions(['fetchDevices', 'fetchAssets']),
    openPackML: function(assetId) {
      this.openedAssetId = assetId;
      this.$bvModal.show('modal-pack');
    },
    openCapabilityOverview: function(index) {
      this.openedIndex = index;
      this.$bvModal.show('modal-cap');
    },
  },
  created() {
    let that = this;
    this.fetchAssets({ vm: this });

    this.$mqtt.on((topic: string, message: string) => {
      let msg = JSON.parse(message.toString());
      console.log(`Message arrived on topic ${topic}, msg: ${msg}`);
      //TODO: replace commit with dispatch
      this.$store.commit('updateAsset', msg.payload);
    });
  },
});
</script>

<style lang="scss" scoped>
h5 {
  width: 40%;
  float: left;
}
</style>
