import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '@/interfaces/RootState';
import { endpoints } from './modules/endpoints';
import { devices } from './modules/devices';
import { assets } from './modules/assets';
import { users } from './modules/users';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    endpoints,
    devices,
    assets,
    users,
  },
};

export default new Vuex.Store<RootState>(store);
