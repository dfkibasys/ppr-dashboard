import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from "@/interfaces/RootState";
import { AssetsState, Asset } from '@/interfaces/AssetsState';
import axios from "axios";
import store from "..";

const state: AssetsState = {
    assets: []
}

const getters: GetterTree<AssetsState, RootState> = {
    allAssets: (state) => state.assets
}

const actions: ActionTree<AssetsState, RootState> = {
    fetchAssets({commit, dispatch}){
        let assets: Asset[] = [];
        axios.get("/api/v1/registry").then(res => {
            for (let i = 0; i < res.data.length; i++) {
                assets.push({
                    "idShort": res.data[i].asset.idShort,
                    "idSubmodelEndpoint": res.data[i].submodels[0].endpoints[0].address,
                })
          
            }
        })
        .catch(err => console.log(err.message))
        .finally(() => {
            commit('setAssets', assets)
            dispatch('fetchIdSubmodels');
        })
    },
    fetchIdSubmodels(){
        for (let i = 0; i < state.assets.length; i++) {

            //remove domain from endpoint
            let urlSplit = state.assets[i].idSubmodelEndpoint.split('/');
            let path = urlSplit.splice(3, 2).join('/');

            axios.get(`/aas/${path}`).then(res => {
                console.log(res.data)
            })
        }
    }
}

const mutations:MutationTree<AssetsState> = {
    setAssets: (state, assets) => (state.assets = assets),
}

export const assets: Module<AssetsState, RootState> = {
    state,
    getters,
    mutations,
    actions
}