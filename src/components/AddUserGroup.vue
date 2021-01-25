<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-list-item link v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Добавить пользователя</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Выберите пользователя</v-card-title>
      <v-card-text>
        <v-list-item class="px-2" v-for="user in usersNoAdded" :key="user.id" link @click="addUser(user)">
          <v-list-item-avatar>
            <v-img src="https://sun9-29.userapi.com/c850608/v850608943/121897/lWYSNsMB0Js.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-title>{{user.info.surname}} {{user.info.name}}{{user.info.email ? ', ' + user.info.email : ''}}</v-list-item-title>
        </v-list-item>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    dialog: false
  }),
  props: ['group'],
  computed: {
    ...mapGetters(["groups", "users"]),
    usersNoAdded() {
      if(!this.groups || !this.users) return;
      const group = this.groups.find(g => g.id === this.group)
      const users = this.users.filter(user => {
        return Object.keys(group.users).findIndex(key => group.users[key] === user.id) === -1
      });
      return users
    }
  },
  async mounted() {
    this.$store.dispatch("fetchGroups");
    this.$store.dispatch("fetchUsers");
  },
  methods: {
    addUser(user) {
      this.dialog = false
      this.$store.dispatch("addUserGroup", {id: this.group, uid: user.id});
      this.$store.dispatch("fetchGroups");
      this.$store.dispatch("fetchUsers");
    }
  }
};
</script>
