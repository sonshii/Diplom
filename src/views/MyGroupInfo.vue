<template>
  <div class="main-page-wrapper col-lg-12 d-flex">
    <left-panel />
    <div
            class="d-flex align-start flex-wrap flex-row justify-between"
    >
      <v-row>
        <v-col>
          <note-create :group="id" />
          <v-card class="mx-auto mt-4" width="344">
            <v-list-item three-line light :to="'/MyGroup/' + id + '/Notes'">
              <v-list-item-content>
                <v-list-item-title class="headline mb-1 text-center">Заметки группы</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col>

          <abstract-create :group="id" />
          <v-card class="mx-auto mt-4" width="344">
            <v-list-item three-line light :to="'/MyGroup/' + id + '/Abstracts'">
              <v-list-item-content>
                <v-list-item-title class="headline mb-1 text-center">Конспекты группы</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col>
          <add-user-group :group="id" />
          <v-card class="mx-auto mt-4" width="344">
            <v-dialog v-model="dialogUsers" width="500">
              <template v-slot:activator="{ on }">
                <v-list-item three-line link v-on="on">
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1 text-center">Пользователи группы</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Пользователи группы</v-card-title>
                <v-card-text>
                  <v-list-item class="px-2" v-for="user in usersGroup" :key="user.id">
                    <v-list-item-avatar>
                      <v-img src="https://sun9-29.userapi.com/c850608/v850608943/121897/lWYSNsMB0Js.jpg"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-title>{{user.info.surname}} {{user.info.name}}{{user.info.email ? ', ' + user.info.email : ''}}</v-list-item-title>
                    <v-list-item-action v-if="uid === selectedGroup.created && uid !== user.id">
                      <v-btn text x-small @click="deleteUser(user.id)">
                        <v-icon x-small>mdi-close-thick</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
/*eslint-disable */
import NoteCreate from "../components/NoteCreate";
import AddUserGroup from "../components/AddUserGroup";
import AbstractCreate from "../components/AbstractCreate";
import LeftPanel from "../components/LeftPanel";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
export default {
  props: ['id'],
  components: {
    LeftPanel,
    NoteCreate,
    AbstractCreate,
    AddUserGroup
  },
  data: () => ({
    dialogUsers: false,
    uid: '',
    current: null,
    dialog: false,
    nameOfGroup: ""
  }),
  validations: {
    nameOfGroup: { required }
  },
  computed: {
    ...mapGetters(["groups", "users"]),
    selectedGroup() {
      if(!this.groups) return;
      return this.groups.find(g => g.id === this.id)
    },
    usersGroup() {
      if(!this.groups || !this.users) return;
      const group = this.groups.find(g => g.id === this.id)
      const users = this.users.filter(user => {
        return Object.keys(group.users).findIndex(key => group.users[key] === user.id) !== -1
      });
      return users
    }
  },
  async mounted() {
    this.$store.dispatch("fetchGroups");
    this.$store.dispatch("fetchUsers");
    this.uid = await this.$store.dispatch("getUid");
  },
  methods: {
    deleteUser(id) {
      const group = this.groups.find(g => g.id === this.id)
      const key = Object.keys(group.users).find(key => group.users[key] === id)
      this.$store.dispatch("deleteUserGroup", { id: group.id, key, uid: id });
    },
    editGroup(group) {
      this.current = group.id;
      this.nameOfGroup = group.nameOfGroup;
    },
    removeGroup(group) {
      this.$store.dispatch("deleteGroup", {
        id: group.id
      });
    },
    async updateGroup() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.$store.dispatch("updateGroup", {
          id: this.current,
          nameOfGroup: this.nameOfGroup
        });
        this.dialog = false;
      } catch (e) {}
    },
  }
};
</script>
