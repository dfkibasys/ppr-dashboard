import UsersState from '@/types/UsersState';
import bcrypt from 'bcryptjs';

const state: UsersState = {
  loggedInUser: 'admin',
  authorized: true,
  hash: '$2a$10$V8BJ.Dhiw9t310rmSiGRgu7AXqsVEbsauGdWS6Y7xGSbX3.u6Hgo2',
};

const getters = {
  /**
   * Get the currently logged in user
   *
   * @param state
   * @returns {String}
   */
  currentUser: (state) => state.loggedInUser,

  /**
   * Get whether the user is authorized
   *
   * @param state
   * @returns {Boolean}
   */
  isAuthorized: (state) => state.authorized,
};

const mutations = {
  /**
   * commit the logged in user to state
   *
   * @param state
   * @param user
   */
  loginUser: (state, user) => {
    state.loggedInUser = user;
    state.authorized = true;
  },

  /**
   * commit a logged out user to state
   * @param state
   */
  logoutUser: (state) => {
    state.loggedInUser = '';
    state.authorized = false;
  },
};
const actions = {
  /**
   * If the provided credentials are valid, log in the user,
   * if not, reject the request
   *
   * @param commit
   * @param data
   * @returns
   */
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

  /**
   * Log out the currently logged in user
   *
   * @param commit
   */
  logoutUser: ({ commit }) => {
    commit('logoutUser');
  },
};

export const users = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
