<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <b-navbar-brand href="#">
        <img src="@/assets/logo_190_52_30jahre.png" class="mr-3" width="150" alt />
        <img src="@/assets/Logo_BaSys4_1024px-300x79.png" width="150" alt />
      </b-navbar-brand>

      <b-navbar-nav is-nav class="flex-row">
        <b-link class="pr-3" to="/devices">{{$t("navbar.devices")}}</b-link>
        <b-link class="pr-3" to="/services">{{$t("navbar.services")}}</b-link>
        <b-link class="pr-3" to="/management">{{$t("navbar.management")}}</b-link>
        <b-link class="pr-3" to="/processes">{{$t("navbar.processes")}}</b-link>
      </b-navbar-nav>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" class="navbar-collapse" is-nav>
        <b-container>
          <b-row>
            <b-col>{{$t('navbar.language')}}:</b-col>
            <b-col cols="9">
              <b-form-select v-model="$i18n.locale" :options="langs"></b-form-select>
            </b-col>
            <div class="w-100"></div>
            <b-col>Registry URL:</b-col>
            <b-col class="rest" cols="9">
              <input class="form-control" v-model="registryUrl" />
              <button
                type="button"
                class="btn btn-success"
                @click="changeREGISTRYdata"
              >{{$t('navbar.change')}}</button>
            </b-col>
            <div class="w-100"></div>
            <b-col>Broker URL:</b-col>
            <b-col class="rest" cols="9">
              <input class="form-control" v-model="mqttUrl" />
              <button
                type="button"
                class="btn btn-success"
                @click="changeMQTTdata"
              >{{$t('navbar.change')}}</button>
            </b-col>
            <div class="w-100"></div>
            <b-col>{{$t('navbar.mockObjects')}} <b-icon-info-circle-fill v-b-popover.hover.right="$t('navbar.info')"></b-icon-info-circle-fill>:</b-col>
            <b-col cols="9">
              <b-form-checkbox name="check-button" v-model="mockDataEnabled" switch></b-form-checkbox>
            </b-col>
            <div class="w-100"></div>
            <b-col>BaSys URL:</b-col>
            <b-col class="rest" cols="9">
              <input class="form-control" v-model="basysUrl" />
              <button
                type="button"
                class="btn btn-success"
                @click="changeBASYSdata"
              >{{$t('navbar.change')}}</button>
            </b-col>
            <div class="w-100"></div>
            <b-col>Camunda URL:</b-col>
            <b-col class="rest" cols="9">
              <input class="form-control" v-model="camundaUrl" />
            </b-col>
            <div class="w-100"></div>
            <b-col></b-col>
            <b-col cols="9">
              <button type="button" class="btn btn-info float-right" v-b-modal.modal-licences>
                <b-icon-question font-scale="2"></b-icon-question>
              </button>
            </b-col>
          </b-row>
        </b-container>
      </b-collapse>
    </nav>
    <Licences></Licences>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from "vuex";
import Licences from "@/components/modals/Licences.vue";
import { Data, Methods, Computed, Props } from "@/interfaces/INavbar";

export default Vue.extend<Data, Methods, Computed, Props>({
  name: "Navbar",
  components: {
    Licences
  },
  data() {
    return {
      langs: [
        { value: "de", text: "Deutsch" },
        { value: "en", text: "English" }
      ]
    };
  },
  computed: {
    //using a two-way computed property with a setter to mutate vuex states
    registryUrl: {
      get() {
        return this.$store.getters.registryUrl;
      },
      set(value) {
        this.$store.commit("setRegistryUrl", value);
      }
    },
    basysUrl: {
      get() {
        return this.$store.getters.basysUrl;
      },
      set(value) {
        this.$store.commit("setBasysUrl", value);
      }
    },
    mqttUrl: {
      get() {
        return this.$store.getters.mqttUrl;
      },
      set(value) {
        this.$store.commit("setMqttUrl", value);
      }
    },
    camundaUrl: {
      get() {
        return this.$store.getters.camundaUrl;
      },
      set(value) {
        this.$store.commit("setCamundaUrl", value);
      }
    },
    mockDataEnabled: {
      get() {
        return this.$store.getters.mockDataEnabled;
      },
      set(value) {
        this.$store.commit("switchMockDataState", value);
        this.fetchDevices({vm: this});
      }
    }
  },
  methods: {
    ...mapActions(["fetchDevices", "fetchAssets"]),
    changeMQTTdata() {
      this.$mqtt.end();
      this.$mqtt.connect();
    },
    changeREGISTRYdata(){
      this.fetchAssets();
    },
    changeBASYSdata() {
      this.fetchDevices({vm: this});
    }
  }
});
</script>

<style scoped lang="scss">
a {
  color: gray;
}
.router-link-active {
  color: darken(gray, 50%);
}

.navbar-collapse {
  .container {
    max-width: 970px;
  }
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
}
</style>