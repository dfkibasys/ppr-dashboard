<template>
  <b-modal id="modal-settings" ref="modal" size="lg" :title="$t('modal.settings.title')">
    <b-container>
      <b-row>
        <b-col>{{ $t('modal.settings.language') }}:</b-col>
        <b-col cols="9">
          <b-form-select v-model="$i18n.locale" :options="langs"></b-form-select>
        </b-col>
        <div class="w-100"></div>
        <b-col>Registry URL:</b-col>
        <b-col class="rest" cols="9">
          <input class="form-control" v-model="registryUrl" />
          <button type="button" class="btn btn-success" @click="changeREGISTRYdata">{{
            $t('modal.settings.change')
          }}</button>
        </b-col>
        <div class="w-100"></div>
        <b-col>Broker URL:</b-col>
        <b-col class="rest" cols="9">
          <input class="form-control" v-model="mqttUrl" />
          <button type="button" class="btn btn-success" @click="changeMQTTdata">{{
            $t('modal.settings.change')
          }}</button>
        </b-col>
        <div class="w-100"></div>
        <b-col
          >{{ $t('modal.settings.mockObjects') }}
          <b-icon-info-circle-fill
            v-b-popover.hover.right="$t('modal.settings.info')"
          ></b-icon-info-circle-fill
          >:</b-col
        >
        <b-col cols="9">
          <b-form-checkbox name="check-button" v-model="mockDataEnabled" switch></b-form-checkbox>
        </b-col>
        <!-- <div class="w-100"></div>
            <b-col>BaSys URL:</b-col>
            <b-col class="rest" cols="9">
              <input class="form-control" v-model="basysUrl" />
              <button type="button" class="btn btn-success" @click="changeBASYSdata">{{
                $t('navbar.change')
              }}</button>
            </b-col> -->
        <div class="w-100"></div>
        <b-col>Camunda URL:</b-col>
        <b-col class="rest" cols="9">
          <input class="form-control" v-model="camundaUrl" />
        </b-col>
        <div class="w-100"></div>
        <b-col></b-col>
        <b-col cols="9">
          <button type="button" class="btn btn-info float-right" v-b-modal.modal-licences>
            <b-icon-question font-scale="2" />
          </button>
        </b-col>
      </b-row>
    </b-container>
    <template v-slot:modal-footer="{ cancel }">
      <b-button variant="secondary" @click="cancel">{{ $t('modal.close') }}</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/ISettings';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'Settings',
  data() {
    return {
      langs: [
        { value: 'de', text: 'Deutsch' },
        { value: 'en', text: 'English' },
      ],
    };
  },
  watch: {
    mockDataEnabled() {
      this.fetchAssets({ vm: this });
    },
  },
  methods: {
    ...mapActions('assets', {
      fetchAssets: 'fetchAssets',
    }),
    changeMQTTdata() {
      this.$mqtt.end();
      this.$mqtt.connect();
    },
    changeREGISTRYdata() {
      this.fetchAssets({ vm: this });
    },
    changeBASYSdata() {},
  },
  computed: {
    /**
     * Using a two-way computed property with a setter to mutate vuex states
     */
    registryUrl: {
      get() {
        return this.$store.getters['endpoints/registryUrl'];
      },
      set(value) {
        this.$store.commit('endpoints/setRegistryUrl', value);
      },
    },
    basysUrl: {
      get() {
        return this.$store.getters['endpoints/basysUrl'];
      },
      set(value) {
        this.$store.commit('endpoints/setBasysUrl', value);
      },
    },
    mqttUrl: {
      get() {
        return this.$store.getters['endpoints/mqttUrl'];
      },
      set(value) {
        this.$store.commit('endpoints/setMqttUrl', value);
      },
    },
    camundaUrl: {
      get() {
        return this.$store.getters['endpoints/camundaUrl'];
      },
      set(value) {
        this.$store.commit('endpoints/setCamundaUrl', value);
      },
    },
    mockDataEnabled: {
      get() {
        return this.$store.getters['endpoints/mockDataEnabled'];
      },
      set(value) {
        this.$store.commit('endpoints/switchMockDataState', value);
      },
    },
  },
});
</script>

<style lang="scss">
.col-9 {
  margin-bottom: 5px;
  line-height: 35px;
  text-align: left;
}

.rest {
  display: grid;
  grid-template-columns: auto 100px;
  grid-gap: 10px;
}
</style>