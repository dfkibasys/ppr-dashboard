//Import
import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import mqtt from '@/mqtt';
import Axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueI18n from 'vue-i18n';
import messages from '@/lang';
import VueProgressBar from 'vue-progressbar';

//Options
Axios.defaults.timeout = 4000;

const ProgressBarOptions = {
  color: '#385ebc',
  failedColor: 'red',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300,
  },
  position: 'relative',
};

const i18nOptions = {
  locale: 'en',
  fallbackLocale: 'en',
  messages,
};

Vue.prototype.$mqtt = mqtt;

//Usage
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueI18n);
const i18n = new VueI18n(i18nOptions);
Vue.use(VueProgressBar, ProgressBarOptions);

new Vue({
  render: (h) => h(App),
  i18n,
  router,
  store,
}).$mount('#app');
