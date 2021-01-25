/*eslint-disable */

import firebase from "firebase/app";

export default {
  actions: {
    async login({ dispatch, commit }, { email, pass }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
      } catch (e) {
        commit('setError', e)
        throw e;
      }
    },
    async register({ dispatch, commit }, { name, surname, email, pass, confpass }) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, pass);
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/info`)
          .set({
            email,
            name,
            surname
          });
      } catch (e) {
        commit('setError', e)
        throw e;
      }
    },
    getUid() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    },
    async logout({ commit }) {
      await firebase.auth().signOut();
      commit("clearInfo");
    }
  }
};

/*eslint-enable */
