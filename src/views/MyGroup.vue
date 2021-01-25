<template>
  <div class="main-page-wrapper col-lg-12 d-flex">
    <left-panel />
    <div
            class="main-content d-flex justify-center align-center flex-column col-lg-12"
            v-if="!groups || !groups.length">
      <img src="../../img/staff.svg" class="background-svg"/>
      <h2 class="head mt-5 font-italic font-weight-light">У вас нет групп</h2>
    </div>
    <div
            class="d-flex align-start flex-wrap flex-row justify-between"
            v-else
    >
      <v-col v-for="(group) in groups" :key="group.id" :value="group.id">
        <v-card class="mx-auto" width="344">
          <v-btn v-if="uid === group.created" text x-small class="float-right" @click="removeGroup(group)">
            <v-icon x-small>mdi-close-thick</v-icon>
          </v-btn>
          <v-btn v-if="uid !== group.created" text x-small class="float-right" @click="exitGroup(group)">
            <v-icon x-small>mdi-exit-to-app</v-icon>
          </v-btn>
          <v-dialog v-model="dialog" width="500" :retain-focus="false">
            <template v-slot:activator="{ on }">
              <v-btn link v-on="on" x-small text class="float-right" @click="editGroup(group)">
                <v-icon x-small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>Редактировать группу</v-card-title>
              <v-card-text>
                <v-form class="px-3" ref="form">
                  <v-text-field
                          label="Название"
                          v-model="nameOfGroup"
                          :class="{invalid: $v.nameOfGroup.$dirty && !$v.nameOfGroup.required}"
                  ></v-text-field>
                  <v-btn class="mx-3 mt-3" color="success" @click="updateGroup">Сохранить</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-list-item three-line  :to="'/MyGroup/' + group.id">
            <v-list-item-content>
              <v-list-item-title class="headline mb-1 text-center" v-text="group.nameOfGroup"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </div>
  </div>
</template>

<script>
/*eslint-disable */
import LeftPanel from "../components/LeftPanel";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
export default {
  components: {
    LeftPanel
  },
  data: () => ({
    uid: '',
    current: null,
    dialog: false,
    nameOfGroup: ""
  }),
  validations: {
    nameOfGroup: { required }
  },
  computed: {
    ...mapGetters(["groups"]),
  },
  async mounted() {
    this.$store.dispatch("fetchGroups");
    this.uid = await this.$store.dispatch("getUid");
  },
  methods: {
    editGroup(group) {
      this.current = group.id;
      this.nameOfGroup = group.nameOfGroup;
    },
    removeGroup(group) {
      this.$store.dispatch("deleteGroup", {
        id: group.id
      });
    },
    exitGroup(group) {
      const key = Object.keys(group.users).find(key => group.users[key] === this.uid)
      this.$store.dispatch("deleteUserGroup", { id: group.id, key, uid: this.uid });
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
