<template>
  <div>
    <div class="cardContainer" id="deviceContainer">
      <div class="card" v-for="asset in assetsList" :key="asset.idShort">
        <div class="card-header">
          <h5 class="card-title">{{ asset.idShort }}</h5>
          <b-button
            v-if="asset.EXMODE"
            @click="openPackML(assetId)"
            class="float-right"
            :variant="buttonVariant(assetId)"
            >{{ asset.EXMODE }} - {{ asset.OPMODE }} ({{ asset.EXST }})</b-button
          >
        </div>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <div class="col-4 image">
                <img :src="asset.TypeThumbnailBase64" />
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
                <a target="_blank" :href="asset.Documentation">{{
                  asset.ManufacturerProductDesignation
                }}</a>
                <br />
                {{ asset.ManufacturerName }}
                <br />
                {{ asset.ProductNumber }}
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <b-button v-if="hasMoreAssets" class="mx-auto d-block" @click="loadMore()">
      {{ $t('button.loadMore') }}</b-button
    >
    <PackML :opened-asset-id="openedAssetId"></PackML>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PackML from '@/components/modals/PackML.vue';
import { mapGetters, mapActions } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IAssets';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'Assets',
  components: {
    PackML,
  },
  computed: {
    ...mapGetters('assets', {
      assetsList: 'assetsList',
      loadedAssets: 'loadedAssets',
      hasLoaded: 'hasLoaded',
      hasMoreAssets: 'hasMoreAssets',
    }),
  },
  data() {
    return {
      openedAssetId: '',
    };
  },
  methods: {
    ...mapActions('assets', {
      fetchAssets: 'fetchAssets',
    }),
    openPackML: function (assetId) {
      this.openedAssetId = assetId;
      this.$bvModal.show('modal-pack');
    },
    buttonVariant: function (assetId) {
      let asset = this.$store.getters('assets/getAssetById', assetId);
      if (asset.EXMODE === 'SIMULATE') {
        return 'secondary';
      } else if (asset.EXMODE === 'AUTO') {
        if (asset.ERRCODE === 0) {
          return 'info';
        } else {
          return 'warning';
        }
      }

      return '';
    },
    scrollCallback: function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.loadMore();
      }
    },
    loadMore: function () {
      if (this.hasMoreAssets) this.$store.dispatch('assets/fetchAssets', { vm: this });
    },
  },
  created() {
    if (!this.hasLoaded) {
      this.$store.dispatch('assets/fetchAssets', { vm: this });

      this.$mqtt.on((topic: string, message: string) => {
        let msg = JSON.parse(message.toString());
        console.log(`Message arrived on topic ${topic}, msg: ${msg.payload}`);
        this.$store.commit('assets/updateAsset', msg.payload);
      });
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollCallback);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollCallback);
  },
});
</script>

<style lang="scss" scoped>
h5 {
  width: 30%;
  float: left;
}
</style>
