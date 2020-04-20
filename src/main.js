import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from "./store"
import mqtt from './mqtt'
import Axios from 'axios'

//Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueI18n from 'vue-i18n'
import messages from "./lang";

import VueProgressBar from 'vue-progressbar'

Axios.defaults.timeout = 4000;

Vue.prototype.$mqtt = mqtt;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueI18n);

//vue-progressbar
const options = {
  color: '#385ebc',
  failedColor: 'red',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  position: 'relative'
}
Vue.use(VueProgressBar, options)

Vue.use(require('vue-moment'));

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: messages
});


new Vue({
  render: h => h(App),
  i18n,
  router,
  store
}).$mount('#app');