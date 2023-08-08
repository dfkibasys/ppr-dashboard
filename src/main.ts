//Import
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter } from '@/router';
import { createStore } from '@/store';
import mqtt from '@/mqtt';
import Axios from 'axios';
import { createI18n } from 'vue-i18n';
import messages from '@/lang';
import VueProgressBar from '@aacassandra/vue3-progressbar';

//Bootstrap
// Import our custom CSS
import './scss/styles.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '@popperjs/core';
import 'bootstrap';

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

const i18n = createI18n({
  locale: 'en',
  legacy: false,
  allowComposition: true,
  fallbackLocale: 'en',
  globalInjection: true,
  messages,
});

const router = createRouter();
const store = createStore(router);
export default store;

const app = createApp(App);

app.config.globalProperties.$mqtt = mqtt;

//Usage
app.use(i18n);
app.use(store);
app.use(router);
app.use(VueProgressBar, ProgressBarOptions);

app.mount('#app');
