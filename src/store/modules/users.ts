import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import UsersState from '@/interfaces/UsersState';
import { RootState } from '@/interfaces/RootState';
import bcrypt from 'bcryptjs';

const state: UsersState = {
  loggedInUser: '',
  authorized: false,
  hash: '$2a$10$V8BJ.Dhiw9t310rmSiGRgu7AXqsVEbsauGdWS6Y7xGSbX3.u6Hgo2',
};

const getters: GetterTree<UsersState, RootState> = {
  currentUser: (state) => state.loggedInUser,
  isAuthorized: (state) => state.authorized,
};

const mutations: MutationTree<UsersState> = {
  loginUser: (state, user) => {
    state.loggedInUser = user;
    state.authorized = true;
  },
  logoutUser: (state) => {
    state.loggedInUser = '';
    state.authorized = false;
  },
};
const actions: ActionTree<UsersState, RootState> = {
  loginUser: ({ commit }, data) => {
    return new Promise<void>((resolve, reject) => {
      let isValidPass = bcrypt.compareSync(data.password, state.hash);
      if (data.user === 'admin' && isValidPass) {
        commit('loginUser', data.user);
        resolve();
      } else {
        reject();
      }
    });
  },
  logoutUser: ({ commit }) => {
    commit('logoutUser');
  },
};

export const users: Module<UsersState, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
