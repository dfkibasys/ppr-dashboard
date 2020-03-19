import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from "./store"
import mqtt from './mqtt'

//Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import VueI18n from 'vue-i18n'
import VueProgressBar from 'vue-progressbar'

Vue.prototype.$mqtt = mqtt;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueI18n);

const options = {
  color: '#385ebc',
  failedColor: 'red',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: false,
  position: 'relative'
}
Vue.use(VueProgressBar, options)

// Ready translated locale messages
const messages = {
  "en": {
    "translation": {
      "type_k": "Type",
      "name_k": "Name",
      "location_k": "Location",
      "serial_k": "Serial",
      "capability_k": "Capability",
      "set_language": "Language",
      "set_change": "Change",
      "menu_devices": "Devices",
      "menu_processes": "Processes",
      "modal_close": "Close",
      "show": "Show"
    }
  },
  "de": {
    "translation": {
      "type_k": "Typ",
      "name_k": "Name",
      "location_k": "Ort",
      "serial_k": "Seriennr.",
      "capability_k": "Fähigkeit",
      "set_language": "Sprache",
      "set_change": "Ändern",
      "menu_devices": "Geräte",
      "menu_processes": "Prozesse",
      "modal_close": "Schließen",
      "show": "Anzeigen"
    }
  }
};

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
});


new Vue({
  render: h => h(App),
  i18n,
  router,
  store
}).$mount('#app');