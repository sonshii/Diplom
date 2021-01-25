import firebase from "firebase/app";

export default {
  actions: {
    async fetchNotes({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const notes =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/notes`)
              .once("value")
          ).val() || {};
        return Object.keys(notes).map(key => ({ ...notes[key], id: key }));
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createNote({ commit, dispatch }, { nameOfNote, descOfNote }) {
      try {
        const uid = await dispatch("getUid");
        const note = await firebase
          .database()
          .ref(`/users/${uid}/notes`)
          .push({ nameOfNote, descOfNote });
        return { nameOfNote, descOfNote, id: note.key };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async deleteNote({ commit, dispatch }, { id }) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/notes`)
          .child(id)
          .remove();
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateNote({ commit, dispatch }, { nameOfNote, descOfNote, id }) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/notes`)
          .child(id)
          .update({ nameOfNote, descOfNote });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    }
  }
};
