import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from '@/interfaces/RootState';
import { AssetsState, IDSubmodel, CCISubmodel, Asset } from '@/interfaces/AssetsState';
import axios from 'axios';
import store from '..';
import {
  RegistryAndDiscoveryInterfaceApi,
  SortDirection,
  SortingPath,
} from '@basys/aas-registry-client-ts-fetch';
import Vue from 'vue';

const PAGE_SIZE = 8;

const state: AssetsState = {
  assets: {
    keyMap: {},
    list: [],
  },
  loadedAssets: 0,
  totalAssets: 0,
  currentPage: 0,
  hasLoaded: false,
};

const getters: GetterTree<AssetsState, RootState> = {
  /**
   * Get all asset keys
   *
   * @param state
   * @returns {Array}
   */
  assetsList: (state) => state.assets.list,

  /**
   * Return the asset with the given id
   *
   * @param state
   * @returns Object | null
   */
  getAssetById: (state) => (id) =>
    state.assets.keyMap[id] !== undefined ? state.assets.list[state.assets.keyMap[id]] : null,

  /**
   * Count all loaded assets
   *
   * @param state
   * @returns {Number}
   */
  loadedAssets: (state) => state.loadedAssets,

  /**
   * Get whether all assets have been loaded from the registry
   *
   * @param state
   * @returns {Boolean}
   */
  hasLoaded: (state) => state.hasLoaded,

  /**
   * Get whether all available assets have been loaded (-1 for mrk lab)
   *
   * @param state
   * @returns
   */
  hasMoreAssets: (state) => state.loadedAssets < state.totalAssets - 1,

  /**
   * Returns the currently loaded page
   *
   * @param state
   * @returns
   */
  getCurrentPage: (state) => state.currentPage,
};

const actions: ActionTree<AssetsState, RootState> = {
  /**
   * Fetch all assets from new dotaas registry
   */
  fetchAssets({ commit, dispatch, getters }, { vm, purge, sort }) {
    if (purge) commit('setCurrentPage', 0);

    const config = {
      basePath: store.getters['endpoints/registryUrl'],
    };
    const api = new RegistryAndDiscoveryInterfaceApi(config);

    // search, paginate and sort
    const body = {
      page: {
        index: getters.getCurrentPage,
        size: PAGE_SIZE,
      },
      sortBy: {
        direction: sort !== undefined ? sort.direction : SortDirection.ASC,
        path: sort !== undefined ? [sort.path] : [SortingPath.IdShort],
      },
    };

    let assets: any = [];
    let totalAssets: number = 0;

    commit('setLoadedAssets', 0);
    vm.$Progress.start();

    api
      .searchShellDescriptors(body)
      .then((response) => {
        totalAssets = response.total;
        //asset loop
        response.hits.forEach((item) => {
          let asset: Asset = {};
          asset.idShort = item.idShort;

          //submodel loop
          item.submodelDescriptors?.forEach((submodel) => {
            let idShort = submodel.idShort;
            let key = '';

            if (idShort?.includes('cc-instance')) {
              key += 'CCInstance';
            } else if (idShort?.includes('cc-interface')) {
              key += 'CCInterface';
            } else {
              key += idShort; // Identification or Capability
            }
            key += 'SubmodelEndpoint';

            asset[key] =
              submodel.endpoints !== undefined
                ? submodel.endpoints[0].protocolInformation.endpointAddress
                : [];
          });

          // don't add mrk lab to assetsList
          if (asset.idShort === 'mrk40_lab_aas') return;
          assets.push(asset);
        });
      })
      .catch((error) => {
        console.error(error);
        vm.$Progress.fail();
      })
      .finally(() => {
        commit('setAssets', { assets, totalAssets, purge });
        dispatch('fetchIdSubmodels', { assets, vm });
        dispatch('fetchCCInterfaceSubmodels', { assets, vm });
      });
  },

  /**
   * Fetch all ID submodels from the AAS server
   *
   * @param commit
   * @param vm
   */
  fetchIdSubmodels({ commit }, { assets, vm }) {
    assets.forEach((asset) => {
      let id: IDSubmodel = {};
      axios
        .get(asset.IdentificationSubmodelEndpoint)
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
          commit('addSubmodel', { assetID: asset.idShort, content: id });
        });
    });
  },

  /**
   * Fetch all control components
   *
   * @param commit
   * @param vm
   */
  fetchCCInterfaceSubmodels({ commit }, { assets, vm }) {
    assets.forEach((asset) => {
      let cci: CCISubmodel = {};

      let url = asset.CCInterfaceSubmodelEndpoint;
      if (url == undefined) return;
      let properties_url = store.getters['endpoints/mockDataEnabled'] ? url : url + '/values';

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
          commit('addSubmodel', { assetID: asset.idShort, content: cci });
        });
    });
  },
};

const mutations: MutationTree<AssetsState> = {
  /**
   * commit all assets to state
   * @param state
   * @param assets
   * @param assetsList
   * @param totalAssets
   * @param purge
   */
  setAssets: (state, { assets, totalAssets, purge }) => {
    if (purge) {
      Vue.set(state.assets, 'keyMap', {});
      Vue.set(state.assets, 'list', []);
    }

    assets.forEach((a) => {
      let newLength = state.assets.list.push(a);
      Vue.set(state.assets.keyMap, a.idShort, newLength - 1);
    });

    state.loadedAssets = state.assets.list.length;
    state.totalAssets = totalAssets;
    state.currentPage += 1;
    state.hasLoaded = true;
  },

  /**
   * commit a new submodel to an asset
   *
   * @param state
   * @param assetID
   * @param content
   * @returns
   */
  addSubmodel: (state, { assetID, content }) => {
    let currentAssetIdx = state.assets.keyMap[assetID];
    if (currentAssetIdx !== undefined) {
      for (const key in content) {
        Vue.set(state.assets.list[currentAssetIdx], key, content[key]);
      }
    }
  },

  /**
   * commit an updated asset to state
   *
   * @param state
   * @param asset
   */
  updateAsset: (state, asset) => {
    let data = JSON.parse(asset);
    let keyNames = Object.keys(data);
    let currentAssetIdx = state.assets.keyMap[data.assetID];

    if (currentAssetIdx !== undefined) {
      // if state property is part of update payload -> update state property
      for (let attr in state.assets.list[currentAssetIdx]) {
        if (keyNames.includes(attr)) {
          Vue.set(state.assets.list[currentAssetIdx], attr, data[attr]);
        }
      }
    }
  },

  /**
   * commit amount of loaded asset to state
   *
   * @param state
   * @param amount
   */
  setLoadedAssets: (state, amount) => (state.loadedAssets = amount),

  /**
   * commit current page to state
   *
   * @param state
   * @param page
   */
  setCurrentPage: (state, page) => (state.currentPage = page),
};

export const assets: Module<AssetsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
