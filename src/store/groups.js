import firebase from "firebase/app";

export default {
  state: {
    groups: null
  },
  getters: {
    groups: state => {
      return state.groups
    },
    users: state => {
      return state.users
    },
  },
  mutations: {
    setGroups(state, groups) {
      state.groups = groups;
    },
    setUsers(state, users) {
      state.users = users;
    },
    addGroup(state, group) {
      state.groups.push(group)
    },
    updateGroup(state, group) {
      let ug = state.groups.find(g => g.id === group.id)
      if(ug) Object.assign(ug, { nameOfGroup: group.nameOfGroup })
    },
    deleteGroup(state, id) {
      let index = state.groups.findIndex(g => g.id === id)
      state.groups.splice(index, 1)
    },
    addNoteGroup(state, {id, key, note}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.notes, { [key]: note })
    },
    updateNoteGroup(state, {id, key, note}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.notes, { [key]: note })
    },
    deleteNoteGroup(state, {id, key}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.notes, { [key]: { deleted: true } })
    },
    addAbstractGroup(state, {id, key, abs}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.abstracts, { [key]: abs })
    },
    updateAbstractGroup(state, {id, key, abs}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.abstracts, { [key]: abs })
    },
    deleteAbstractGroup(state, {id, key}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.abstracts, { [key]: { deleted: true } })
    },
    addUserGroup(state, {id, uid, key}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.users, { [key]: uid })
    },
    deleteUserGroup(state, {id, key}) {
      let group = state.groups.find(g => g.id === id)
      Object.assign(group.users, { [key]: 'deleted'})
    },
  },
  actions: {
    async fetchGroups({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const groups =
          (
            await firebase
              .database()
              .ref(`/groups`)
              .once("value")
          ).val() || {};
        const userGroups = Object.keys(groups).map(key => ({
          ...groups[key],
          id: key
        })).filter(group => {
          return group.users && Object.keys(group.users).findIndex(key => group.users[key] === uid) !== -1
        });
        userGroups.forEach((group) => {
          if(!group.notes) group.notes = {}
          if(!group.abstracts) group.abstracts = {}
        })
        commit('setGroups', userGroups);
        return userGroups
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchUsers({ commit }) {
      try {
        const users =
          (
            await firebase
              .database()
              .ref(`/users`)
              .once("value")
          ).val() || {};
        const usersArr = Object.keys(users).map(key => ({
          info: users[key].info,
          id: key
        }))
        commit('setUsers', usersArr);
        return usersArr
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createGroup({ commit, dispatch }, { nameOfGroup }) {
      try {
        const uid = await dispatch("getUid");
        const ng = { nameOfGroup, created: uid, users: {}, notes: {}, abstracts: {} };
        const group = await firebase
          .database()
          .ref(`/groups`)
          .push(ng);
        ng.id = group.key;
        commit('addGroup', ng);
        await dispatch("addUserGroup", { id: group.key, uid });
        return ng
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateGroup({ commit }, { nameOfGroup, id }) {
      try {
        await firebase
          .database()
          .ref(`/groups`)
          .child(id)
          .update({ nameOfGroup });
        commit('updateGroup', { nameOfGroup, id });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async deleteGroup({ commit }, { id }) {
      try {
        await firebase
          .database()
          .ref(`/groups`)
          .child(id)
          .remove();
        commit('deleteGroup', id);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createAbstractGroup({ commit }, { id, abs }) {
      try {
        const res = await firebase
            .database()
            .ref(`/groups/${id}/abstracts`)
            .push(abs);
        commit('addAbstractGroup', {id, key: res.key, abs});
        return abs
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateAbstractGroup({ commit }, { id, key, abs }) {
      try {
        await firebase
            .database()
            .ref(`/groups/${id}/abstracts`)
            .child(key)
            .update(abs);
        commit('updateAbstractGroup', {id, key, abs});
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async deleteAbstractGroup({ commit }, { id, key }) {
      try {
        await firebase
            .database()
            .ref(`/groups/${id}/abstracts`)
            .child(key)
            .remove();
        commit('deleteAbstractGroup', {id, key});
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createNoteGroup({ commit }, { id, note }) {
      try {
        const res = await firebase
            .database()
            .ref(`/groups/${id}/notes`)
            .push(note);
        commit('addNoteGroup', {id, key: res.key, note});
        return note;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateNoteGroup({ commit }, { id, key, note }) {
      try {
        await firebase
            .database()
            .ref(`/groups/${id}/notes`)
            .child(key)
            .update(note);
        commit('updateNoteGroup', {id, key, note});
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async deleteNoteGroup({ commit }, { id, key }) {
      try {
        await firebase
            .database()
            .ref(`/groups/${id}/notes`)
            .child(key)
            .remove();
        commit('deleteNoteGroup', {id, key});
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async addUserGroup({ commit }, { id, uid }) {
      try {
        const res = await firebase
            .database()
            .ref(`/groups/${id}/users`)
            .push(uid);
        commit('addUserGroup', {id, uid, key: res.key});
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async deleteUserGroup({ commit, dispatch }, { id, key, uid }) {
      const myUid = await dispatch("getUid");
      try {
        await firebase
            .database()
            .ref(`/groups/${id}/users`)
            .child(key)
            .remove();
        commit('deleteUserGroup', {id, key});
        if(myUid === uid) commit('deleteGroup', id);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  }
};



