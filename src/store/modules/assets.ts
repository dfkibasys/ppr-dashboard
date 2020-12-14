import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from "@/interfaces/RootState";
import { AssetsState, IDSubmodel } from '@/interfaces/AssetsState';
import axios from "axios";
import store from "..";

const state: AssetsState = {
    assets: {},
    assetsList: []
}

const getters: GetterTree<AssetsState, RootState> = {
    allAssets: (state) => state.assets
}

const actions: ActionTree<AssetsState, RootState> = {
    fetchAssets({commit, dispatch}){
        let assets:any = {};
        let assetsList:any = [];

        axios.get(store.getters.registryUrl).then(res => {

            for (let i = 0; i < res.data.length; i++) {
                assets[res.data[i].asset.idShort] = {
                    "idSubmodelEndpoint": res.data[i].submodels[0].endpoints[0].address,
                }
                assetsList.push(res.data[i].asset.idShort)
            }
        })
        .catch(err => console.error(err.message))
        .finally(() => {
            commit('setAssets', assets)
            commit('setAssetsList', assetsList)
            dispatch('fetchIdSubmodels');
        })
    },
    fetchIdSubmodels({commit}){
        for (let i = 0; i < state.assetsList.length; i++) {

            let id:IDSubmodel = {};

            axios.get(state.assets[state.assetsList[i]].idSubmodelEndpoint).then(res => {
                for (let j = 0; j < res.data.submodelElements.length; j++) {
                    id[res.data.submodelElements[j].idShort] = res.data.submodelElements[j].value;
                }        
            })
            .catch(err => console.error(err.message))
            .finally(() => {
                commit('addIDSubmodel', {assetID: state.assetsList[i], idSubmodel: id});
            })
        }
    }
}

const mutations:MutationTree<AssetsState> = {
    setAssets: (state, assets) => (state.assets = assets),
    setAssetsList: (state, list) => (state.assetsList = list),
    addIDSubmodel:(state, newSubmodel) => 
        (state.assets[newSubmodel.assetID] = {...state.assets[newSubmodel.assetID], ...newSubmodel.idSubmodel}
    ),
}

export const assets: Module<AssetsState, RootState> = {
    state,
    getters,
    mutations,
    actions
}