import firebase from "firebase/app";

export default {
  state:{
    currentAbs: null,
    nameOfAbstract: "",
    descOfAbstract: ""
  },
  actions: {
    async fetchAbstracts({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const abstracts =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/abstracts`)
              .once("value")
          ).val() || {};
        return Object.keys(abstracts).map(key => ({
          ...abstracts[key],
          id: key
        }));
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createAbstract({ commit, dispatch }, { nameOfAbstract, descOfAbstract }) {
      try {
        const uid = await dispatch("getUid");
        const abstract = await firebase
          .database()
          .ref(`/users/${uid}/abstracts`)
          .push({ nameOfAbstract, descOfAbstract });
        return { nameOfAbstract, descOfAbstract, id: abstract.key };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateAbstract({ commit, dispatch }, { nameOfAbstract, descOfAbstract, id }) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/abstracts`)
          .child(id)
          .update({ nameOfAbstract, descOfAbstract });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async deleteAbstract({ commit, dispatch }, { id }) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/abstracts`)
          .child(id)
          .remove();
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  }
};



