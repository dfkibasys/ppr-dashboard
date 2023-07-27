<template>
  <div class="modal modal-lg fade" id="modal-settings" ref="settingsModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('modal.settings.title') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col">{{ $t('modal.settings.language') }}:</div>
              <div class="col-9">
                <select class="form-select" v-model="$i18n.locale">
                  <option v-for="option in langs" :value="option.value" :key="option.value">{{
                    option.text
                  }}</option>
                </select>
              </div>
              <div class="w-100"></div>
              <div class="col">Registry URL:</div>
              <div class="col-9 rest">
                <input class="form-control" v-model="registryUrl" />
                <button type="button" class="btn btn-success" @click="changeREGISTRYdata">{{
                  $t('modal.settings.change')
                }}</button>
              </div>
              <div class="w-100"></div>
              <div class="col">Broker URL:</div>
              <div class="col-9 rest">
                <input class="form-control" v-model="mqttUrl" />
                <button type="button" class="btn btn-success" @click="changeMQTTdata">{{
                  $t('modal.settings.change')
                }}</button>
              </div>
              <!-- <div class="w-100"></div>
        <div class="col"
          >{{ $t('modal.settings.mockObjects') }}
          <b-icon-info-circle-fill
            v-b-popover.hover.right="$t('modal.settings.info')"
          ></b-icon-info-circle-fill
          >:</div
        >
        <div class="col-9">
          <b-form-checkbox name="check-button" v-model="mockDataEnabled" switch></b-form-checkbox>
        </div> -->
              <div class="w-100"></div>
              <div class="col">Camunda URL:</div>
              <div class="col-9 rest">
                <input class="form-control" v-model="camundaUrl" />
              </div>
              <div class="w-100"></div>
              <div class="col"></div>
              <div class="col-9">
                <button
                  type="button"
                  class="btn btn-info float-end"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-licences"
                >
                  <i class="bi bi-question"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{
              $t('modal.close')
            }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/ISettings';

export default defineComponent({
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
      this.fetchAssets({ vm: this, purge: true });
    },
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