<template>
  <nav class="navbar navbar-light bg-light">
    <b-navbar-brand href="#">
      <img src="@/assets/logo_190_52_30jahre.png" class="mr-3" width="150" alt />
      <img src="@/assets/BaSys-Logo.png" width="150" alt />
    </b-navbar-brand>

    <b-navbar-nav is-nav class="flex-row">
      <b-link class="pr-3" to="/devices">{{$t("translation.menu_devices")}}</b-link>
      <b-link class="pr-3" to="/services">Services</b-link>
      <b-link to="/management">Management</b-link>
    </b-navbar-nav>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" class="navbar-collapse" is-nav>
      <b-container>
        <b-row>
          <b-col>{{$t('translation.set_language')}}:</b-col>
          <b-col cols="9">
            <b-form-select v-model="$i18n.locale" :options="langs"></b-form-select>
          </b-col>
          <div class="w-100"></div>
          <b-col>Broker URL:</b-col>
          <b-col class="rest" cols="9">
            <input class="form-control" v-model="mqttUrl" />
            <button
              type="button"
              class="btn btn-success"
              v-on:click="changeMQTTdata"
            >{{$t('translation.set_change')}}</button>
          </b-col>
          <div class="w-100"></div>
          <b-col>Mock data:</b-col>
          <b-col cols="9">
            <b-form-checkbox name="check-button" @change="changeMockData" switch></b-form-checkbox>
          </b-col>
          <div class="w-100"></div>
          <b-col>BaSys URL:</b-col>
          <b-col class="rest" cols="9">
            <input class="form-control" v-model="basysUrl" />
            <button
              type="button"
              class="btn btn-success"
              v-on:click="changeBASYSdata"
            >{{$t('translation.set_change')}}</button>
          </b-col>
          <div class="w-100"></div>
          <b-col>Camunda URL:</b-col>
          <b-col class="rest" cols="9">
            <input class="form-control" v-model="camundaUrl" />
            <button
              type="button"
              class="btn btn-success"
              v-on:click="changeCAMUNDAdata"
            >{{$t('translation.set_change')}}</button>
          </b-col>
          <div class="w-100"></div>
          <b-col></b-col>
          <b-col cols="9">
            <button
              type="button"
              data-toggle="modal"
              data-target="#buildLicenses"
              class="btn btn-info float-right"
            >
              <b-icon-question font-scale="2"></b-icon-question>
            </button>
          </b-col>
        </b-row>
      </b-container>
    </b-collapse>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      langs: [
        { value: "de", text: "Deutsch" },
        { value: "en", text: "English" }
      ],
      checked: false
    };
  },
  computed: { //using a two-way computed property with a setter to mutate vuex states
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
    }
  },
  methods: {
    changeMockData(checked) {
      //change mockData variable
    },
    changeMQTTdata() {},
    changeBASYSdata() {},
    changeCAMUNDAdata() {}
  }
};
</script>

<style scoped lang="less">
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
    input {
      width: 87%;
      float: left;
    }
    button {
      float: left;
      margin-left: 8px;
    }
  }
}
</style>