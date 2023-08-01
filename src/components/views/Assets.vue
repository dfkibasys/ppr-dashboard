<template>
  <div>
    <div class="d-flex flex-row justify-content-center">
      <div class="dropdown" id="sort-dropdown">
        <button
          class="btn btn-secondary dropdown-toggle m-2"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ $t(sortOptions[activeSort].text) }}
        </button>
        <ul class="dropdown-menu">
          <li
            ><a
              class="dropdown-item"
              href="#"
              v-for="(option, index) in sortOptions"
              :key="option.text"
              :class="{ active: index === activeSort }"
              @click="setOrder(index)"
              >{{ $t(option.text) }}</a
            ></li
          >
        </ul>
      </div>

      <search-field :delay-input="0.2" v-model="search"></search-field>
    </div>
    <div class="scrollable" :id="containerId">
      <div class="cardContainer" id="deviceContainer">
        <div class="card" v-for="asset in assetsList" :key="asset.aasId">
          <div class="card-header">
            <h5 class="card-title"
              ><a target="_blank" :href="asset.aasEndpoint">{{ asset.idShort }}</a></h5
            >
            <button
              type="button"
              class="btn btn-primary float-end"
              v-if="asset.EXMODE"
              @click="openPackML(asset.aasId)"
              data-bs-toggle="modal"
              data-bs-target="#modal-pack"
              :class="buttonVariant(asset)"
              >{{ asset.EXMODE }} - {{ asset.OPMODE }} ({{ asset.EXST }})</button
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
      <button
        type="button"
        v-if="hasMoreAssets"
        class="btn btn-secondary mt-2 mx-auto d-block"
        @click="loadMore()"
      >
        {{ $t('button.loadMore') }}
      </button>
    </div>

    <PackML :opened-asset-id="openedAssetId"></PackML>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PackML from '@/components/modals/PackML.vue';
import { mapGetters, mapActions } from 'vuex';
import { SortDirection, SortingPath } from '@basys/aas-registry-client-ts-fetch';
import SearchField from '@/components/SearchField.vue';
import { Asset } from '@/interfaces/AssetsState';

export default defineComponent({
  name: 'Assets',
  components: {
    PackML,
    SearchField,
  },
  computed: {
    ...mapGetters('assets', {
      assetsList: 'assetsList',
      hasLoaded: 'hasLoaded',
      hasMoreAssets: 'hasMoreAssets',
    }),
  },
  data() {
    return {
      openedAssetId: '',
      activeSort: 0,
      containerId: 'scroll-container',
      sortOptions: [
        {
          text: 'sorting.ascendingIdShort',
          path: SortingPath.IdShort,
          direction: SortDirection.ASC,
        },
        {
          text: 'sorting.descendingIdShort',
          path: SortingPath.IdShort,
          direction: SortDirection.DESC,
        },
      ],
      search: '',
    };
  },
  watch: {
    search() {
      this.loadAssets(true);
    },
  },
  methods: {
    ...mapActions('assets', {
      fetchAssets: 'fetchAssets',
    }),
    openPackML: function (aasId: string) {
      this.openedAssetId = aasId;
    },
    buttonVariant: function (asset: Asset) {
      if (asset.EXMODE === 'SIMULATE') {
        return 'btn-secondary';
      } else if (asset.EXMODE === 'AUTO') {
        if (asset.ERRCODE === 0) {
          return 'btn-info';
        } else {
          return 'btn-warning';
        }
      }

      return '';
    },
    scrollCallback: function () {
      let sh = document.getElementById(this.containerId)?.scrollHeight ?? 0;
      let st = document.getElementById(this.containerId)?.scrollTop ?? 0;
      let oh = document.getElementById(this.containerId)?.offsetHeight ?? 0;

      if (sh - st - oh < 1) this.loadMore();
    },
    loadMore: function () {
      if (this.hasMoreAssets) this.loadAssets();
    },
    loadAssets: function (purge = false) {
      const sort = this.sortOptions[this.activeSort];
      this.$store.dispatch('assets/fetchAssets', { vm: this, purge, sort, search: this.search });
    },
    setOrder: function (option: number) {
      this.activeSort = option;
      this.loadAssets(true);
    },
  },
  created() {
    if (!this.hasLoaded) {
      this.loadAssets();

      this.$mqtt.on((topic: string, message: string) => {
        let msg = JSON.parse(message.toString());
        console.log(`Message arrived on topic ${topic}, msg: ${msg.payload}`);
        this.$store.commit('assets/updateAsset', msg.payload);
      });
    }
  },
  mounted() {
    document.getElementById(this.containerId)?.addEventListener('scroll', this.scrollCallback);
  },
  beforeUnmount() {
    document.getElementById(this.containerId)?.removeEventListener('scroll', this.scrollCallback);
  },
});
</script>

<style lang="scss" scoped>
h5 {
  width: 30%;
  float: left;
}

.scrollable {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 150px);
}
</style>
