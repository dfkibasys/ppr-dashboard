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

    let registry_url = store.getters.mockDataEnabled
      ? '/data/registry.json'
      : store.getters.registryUrl;

    vm.$Progress.start();

    axios
      .get(registry_url)
      .then((res) => {
        //asset loop
        res.data.forEach((item) => {
          let assetId = item.asset.identification.id;
          let idShort = item.asset.idShort;
          assets[assetId] = { idShort };

          //submodel loop
          item.submodels.forEach((submodel) => {
            let idShort = submodel.idShort;
            let key = '';

            if (idShort.includes('cc-instance')) {
              key += 'CCInstance';
            } else if (idShort.includes('cc-interface')) {
              key += 'CCInterface';
            } else {
              key += idShort; // Identification or Capability
            }
            key += 'SubmodelEndpoint';

            assets[assetId][key] = submodel.endpoints[0].address;
          });

          // don't add mrk lab to assetsList
          if (item.asset.category != undefined && item.asset.category == 'CONSTANT') return;

          assetsList.push(assetId);
        });
      })
      .catch((err) => {
        console.error(err.message);
        vm.$Progress.fail();
      })
      .finally(() => {
        commit('setAssets', assets);
        commit('setAssetsList', assetsList);
        dispatch('fetchIdSubmodels', { vm });
        dispatch('fetchCCInterfaceSubmodels', { vm });
      });
  },
  fetchIdSubmodels({ commit }, { vm }) {
    state.assetsList.forEach((assetId) => {
      let id: IDSubmodel = {};

      axios
        .get(state.assets[assetId].IdentificationSubmodelEndpoint)
        .then((res) => {
          res.data.submodelElements.forEach((submodelElement) => {
            id[submodelElement.idShort] = submodelElement.value;
          });
        })
        .catch((err) => {
          console.error(err.message);
          vm.$Progress.fail();
        })
        .finally(() => {
          vm.$Progress.finish(); //TODO: finish only when fetchCCInterfaceSubmodels's finally was triggered too
          commit('addSubmodel', { assetID: assetId, content: id });
        });
    });
  },
  fetchCCInterfaceSubmodels({ commit }, { vm }) {
    state.assetsList.forEach((assetId) => {
      let cci: CCISubmodel = {};

      let url = state.assets[assetId].CCInterfaceSubmodelEndpoint;
      if (url == undefined) return;
      let properties_url = store.getters.mockDataEnabled ? url : url + '/values';

      axios
        .get(properties_url)
        .then((res) => {
          let status = res.data.Status;
          for (const attr in status) {
            cci[attr] = status[attr];
          }

          let topic = res.data.updateEvent.keys[0].value;
          vm.$mqtt.subscribe(`${topic}/update`);
        })
        .catch((err) => {
          console.error(err.message);
          vm.$Progress.fail();
        })
        .finally(() => {
          commit('addSubmodel', { assetID: assetId, content: cci });
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
  updateAsset: (state, asset) => {
    let data = JSON.parse(asset);
    let keyNames = Object.keys(data);

    // if state property is part of update payload -> update state property
    for (let attr in state.assets[data.assetId]) {
      if (keyNames.includes(attr)) {
        state.assets[data.assetId][attr] = data[attr];
      }
    }
  },
};

export const assets: Module<AssetsState, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
