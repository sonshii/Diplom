import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import info from "./info";
import notes from "./notes";
import abstracts from "./abstracts"
import groups from "./groups"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error:null
  },

  mutations: {
    setError(state,error){
      state.error = error
    },
    clearError(state){
      state.error = null
    }
  },

  actions: {},

  getters: {
    error: s => s.error
  },

  modules: {
    auth,
    info,
    notes,
    abstracts,
    groups
  }
});
