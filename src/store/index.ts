import { createStore as _createStore } from 'vuex';
import { endpoints } from './modules/endpoints';
import { assets } from './modules/assets';
import { users } from './modules/users';

export function createStore(router) {
  return _createStore({
    state: {
      version: '1.0.0',
      get route() {
        return router.currentRoute.value;
      },
    },
    modules: {
      endpoints,
      assets,
      users,
    },
  });
}
