import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from '@/interfaces/RootState';
import { AssetsState, IDSubmodel, CCISubmodel } from '@/interfaces/AssetsState';
import axios from 'axios';
import store from '..';

const state: AssetsState = {
  assets: {},
  assetsList: [],
};

const getters: GetterTree<AssetsState, RootState> = {
  allAssets: (state) => state.assets,
  assetsList: (state) => state.assetsList,
};

const actions: ActionTree<AssetsState, RootState> = {
  fetchAssets({ commit, dispatch }, { vm }) {
    let assets: any = {};
    let assetsList: any = [];

    vm.$Progress.start();

    axios
      .get(store.getters.registryUrl)
      .then((res) => {
        //asset loop
        for (let i = 0; i < res.data.length; i++) {
          let idShort = res.data[i].asset.idShort;
          assets[idShort] = {};

          //submodel loop
          for (let j = 0; j < res.data[i].submodels.length; j++) {
            let submodel = res.data[i].submodels[j].semanticId.keys[0].value + 'SubmodelEndpoint'; // Identification or ControlComponentInterface/Configuration
            assets[idShort][submodel] = res.data[i].submodels[j].endpoints[0].address;
          }

          assetsList.push(idShort);
        }
      })
      .catch((err) => {
        console.error(err.message);
        vm.$Progress.fail();
      })
      .finally(() => {
        commit('setAssets', assets);
        commit('setAssetsList', assetsList);
        dispatch('fetchIdSubmodels', { vm });
        dispatch('fetchCCISubmodels', { vm });
      });
  },
  fetchIdSubmodels({ commit }, { vm }) {
    state.assetsList.forEach((idShort) => {
      let id: IDSubmodel = {};

      axios
        .get(state.assets[idShort].IdentificationSubmodelEndpoint)
        .then((res) => {
          for (let i = 0; i < res.data.submodelElements.length; i++) {
            id[res.data.submodelElements[i].idShort] = res.data.submodelElements[i].value;
          }
        })
        .catch((err) => {
          console.error(err.message);
          vm.$Progress.fail();
        })
        .finally(() => {
          vm.$Progress.finish(); //TODO: finish only when fetchCCISubmodels's finally was triggered too
          commit('addSubmodel', { assetID: idShort, content: id });
        });
    });
  },
  fetchCCISubmodels({ commit }, { vm }) {
    state.assetsList.forEach((idShort) => {
      let cci: CCISubmodel = {};

      let url = state.assets[idShort].ControlComponentInterfaceSubmodelEndpoint;
      if (url == undefined) return;

      axios
        .get(`${url}/properties`)
        .then((res) => {
          res.data.forEach((prop) => {
            cci[prop.idShort] = prop.value;
          });
        })
        .catch((err) => {
          console.error(err.message);
          vm.$Progress.fail();
        })
        .finally(() => {
          commit('addSubmodel', { assetID: idShort, content: cci });
        });
    });
  },
};

const mutations: MutationTree<AssetsState> = {
  setAssets: (state, assets) => (state.assets = assets),
  setAssetsList: (state, list) => (state.assetsList = list),
  addSubmodel: (state, newSubmodel) =>
    (state.assets[newSubmodel.assetID] = {
      ...state.assets[newSubmodel.assetID],
      ...newSubmodel.content,
    }),
};

export const assets: Module<AssetsState, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
