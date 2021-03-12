import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '@/interfaces/RootState';
import { endpoints } from './modules/endpoints';
import { assets } from './modules/assets';
import { users } from './modules/users';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    endpoints,
    assets,
    users,
  },
};

export default new Vuex.Store<RootState>(store);
