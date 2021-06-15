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
        for (let i = 0; i < res.data.length; i++) {
          let assetId = res.data[i].asset.identification.id;
          let idShort = res.data[i].asset.idShort;
          assets[assetId] = { idShort };

          //submodel loop
          for (let j = 0; j < res.data[i].submodels.length; j++) {
            let submodel = res.data[i].submodels[j].idShort + 'SubmodelEndpoint'; // Identification, Capability or ControlComponentInterface/Configuration

            // emporary proxy workaround
            let address = res.data[i].submodels[j].endpoints[0].address.replace(
              /localhost:4001/i,
              'localhost:8081'
            );

            assets[assetId][submodel] = address;
          }

          assetsList.push(assetId);
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
    state.assetsList.forEach((assetId) => {
      let id: IDSubmodel = {};

      axios
        .get(state.assets[assetId].IdentificationSubmodelEndpoint)
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
          commit('addSubmodel', { assetID: assetId, content: id });
        });
    });
  },
  fetchCCISubmodels({ commit }, { vm }) {
    state.assetsList.forEach((assetId) => {
      let cci: CCISubmodel = {};

      let url = state.assets[assetId].ControlComponentInterfaceSubmodelEndpoint;
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
