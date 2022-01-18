<template>
  <div>
    <div class="cardContainer" id="deviceContainer">
      <div
        class="card"
        v-for="(assetId, index) in limitedAssetsList"
        :key="limitedAssetsList[index]"
      >
        <div class="card-header">
          <h5 class="card-title">{{ allAssets[assetId].idShort }}</h5>
          <b-button
            v-if="allAssets[assetId].EXMODE"
            @click="openPackML(assetId)"
            class="float-right"
            :variant="buttonVariant(assetId)"
            >{{ allAssets[assetId].EXMODE }} - {{ allAssets[assetId].OPMODE }} ({{
              allAssets[assetId].EXST
            }})</b-button
          >
        </div>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <div class="col-4 image">
                <img :src="allAssets[assetId].TypeThumbnail" />
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
                {{ allAssets[assetId].ProductNumber }}
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
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
      allAssets: 'allAssets',
      assetsList: 'assetsList',
      loadedAssets: 'loadedAssets',
      hasLoaded: 'hasLoaded',
    }),
    sortedAssetsList: function () {
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
    limitedAssetsList: function () {
      return this.assetsList.slice(0, this.loadedAssets);
    },
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
      if (this.allAssets[assetId].EXMODE === 'SIMULATE') {
        return 'secondary';
      } else if (this.allAssets[assetId].EXMODE === 'AUTO') {
        if (this.allAssets[assetId].ERRCODE === 0) {
          return 'info';
        } else {
          return 'warning';
        }
      }

      return '';
    },
    scrollCallback: function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.$store.dispatch('assets/fetchIdSubmodels', { vm: this });
      }
    },
  },
  created() {
    if (!this.hasLoaded) {
      this.fetchAssets({ vm: this });

      this.$mqtt.on((topic: string, message: string) => {
        let msg = JSON.parse(message.toString());
        console.log(`Message arrived on topic ${topic}, msg: ${msg.payload}`);
        //TODO: replace commit with dispatch
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
