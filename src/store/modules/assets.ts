import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from '@/interfaces/RootState';
import { AssetsState, IDSubmodel, CCISubmodel, Asset } from '@/interfaces/AssetsState';
import axios from 'axios';
import store from '..';
import {
  RegistryAndDiscoveryInterfaceApi,
  SortDirection,
  SortingPath,
  ShellDescriptorQuery,
} from '@basys/aas-registry-client-ts-fetch';
import Vue from 'vue';

const PAGE_SIZE = 8;

const state: AssetsState = {
  assetMap: {}, // map of aasIds to asset objects
  assetList: [], // list of aasIds displayed under control components
  totalAssets: 0,
  currentPage: 0,
  hasLoaded: false,
};

const getters: GetterTree<AssetsState, RootState> = {
  /**
   * Get all assets
   *
   * @param state
   * @returns {Array}
   */
  assetsList: (state) => state.assetList.map((id) => state.assetMap[id]),

  /**
   * Return the asset with the given id
   *
   * @param state
   * @returns {Asset} | null
   */
  getAssetById: (state) => (id) => state.assetMap[id] !== undefined ? state.assetMap[id] : null,

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
   * @returns {Boolean}
   */
  hasMoreAssets: (state) => state.assetList.length < state.totalAssets - 1,

  /**
   * Returns the currently loaded page
   *
   * @param state
   * @returns {Number}
   */
  getCurrentPage: (state) => state.currentPage,
};

const actions: ActionTree<AssetsState, RootState> = {
  /**
   * Fetch paginated, sorted and filtered assets from registry
   *
   * @param commit
   * @param dispatch
   * @param getters
   * @param vm
   * @param purge
   * @param sort
   * @param search
   */
  fetchAssets({ commit, dispatch, getters }, { vm, purge, sort, search = '' }) {
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
      query: {
        path: 'idShort',
        value: `[a-zA-Z0-9_]*${search}[a-zA-Z0-9_]*`,
        queryType: ShellDescriptorQuery.QueryTypeEnum.Regex,
      },
    };

    let assets: any = [];
    let totalAssets: number = 0;

    vm.$Progress.start();

    api
      .searchShellDescriptors(body)
      .then((response) => {
        totalAssets = response.total;
        //asset loop
        response.hits.forEach((item) => {
          let asset: Asset = {};
          asset.idShort = item.idShort;
          asset.aasId = item.identification;

          //submodel loop
          item.submodelDescriptors?.forEach((submodel) => {
            let idShort = submodel.idShort;
            let key = '';

            if (idShort?.includes('CCInstance')) {
              key += 'CCInstance';
            } else if (idShort?.includes('CCInterface')) {
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
   * @param assets
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
          commit('addSubmodel', { aasID: asset.aasId, content: id });
        });
    });
  },

  /**
   * Fetch all control components
   *
   * @param commit
   * @param assets
   * @param vm
   */
  fetchCCInterfaceSubmodels({ commit }, { assets, vm }) {
    assets.forEach((asset) => {
      let cci: CCISubmodel = {};

      let url = asset.CCInterfaceSubmodelEndpoint;
      if (url == undefined) return;
      const properties_url = store.getters['endpoints/mockDataEnabled'] ? url : url + '/values';
      const update_url = store.getters['endpoints/mockDataEnabled']
        ? url
        : url + '/submodelElements/updateEvent';

      axios
        .all([axios.get(properties_url), axios.get(update_url)])
        .then(
          axios.spread((props, update) => {
            let status = props.data.Status;
            for (const attr in status) {
              cci[attr] = status[attr];
            }

            let topic = update.data.messageTopic;
            vm.$mqtt.subscribe(topic);
          })
        )
        .catch((err) => {
          console.error(err.message);
          vm.$Progress.fail();
        })
        .finally(() => {
          commit('addSubmodel', { aasID: asset.aasId, content: cci });
        });
    });
  },
};

const mutations: MutationTree<AssetsState> = {
  /**
   * Commit all assets to state
   *
   * @param state
   * @param assets
   * @param totalAssets
   * @param purge
   */
  setAssets: (state, { assets, totalAssets, purge }) => {
    if (purge) {
      state.assetList = [];
      state.assetMap = {};
    }

    assets.forEach((a) => {
      Vue.set(state.assetMap, a['aasId'], a);
      if (!state.assetList.includes(a['aasId'])) state.assetList.push(a['aasId']);
    });

    state.totalAssets = totalAssets;
    state.currentPage += 1;
    state.hasLoaded = true;
  },

  /**
   * Commit a new submodel to an asset
   *
   * @param state
   * @param aasID
   * @param content
   */
  addSubmodel: (state, { aasID, content }) => {
    if (state.assetMap[aasID] !== undefined) {
      for (const key in content) {
        Vue.set(state.assetMap[aasID], key, content[key]);
      }
    }
  },

  /**
   * Commit an updated asset to state
   *
   * @param state
   * @param asset
   */
  updateAsset: (state, asset) => {
    let data = JSON.parse(asset);
    let keyNames = Object.keys(data);

    if (state.assetMap[data.aasId] !== undefined) {
      // if state property is part of update payload -> update state property
      for (let attr in state.assetMap[data.aasId]) {
        if (keyNames.includes(attr)) {
          Vue.set(state.assetMap[data.aasId], attr, data[attr]);
        }
      }
    }
  },

  /**
   * Commit current page to state
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
