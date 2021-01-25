<template>
  <div class="main-page-wrapper col-lg-12 d-flex">
    <left-panel />
    <div
      class="main-content d-flex justify-center align-center flex-column col-lg-12"
      v-if="!notes || notes.length < 1"
    >
      <img src="../../img/edit.svg" class="background-svg" />
      <h2 class="head mt-5 font-italic font-weight-light">В группе нет заметок</h2>
    </div>
    <div
      class="d-flex align-start flex-wrap flex-row justify-between"
    >
      <v-col v-for="(note) in notes" :key="note.id" :value="note.id">
        <v-card class="mx-auto" width="344" outlined shaped>
          <v-btn text x-small class="float-right" @click="removeNote(note)">
            <v-icon x-small>mdi-close-thick</v-icon>
          </v-btn>
          <v-dialog v-model="dialog" width="500" :retain-focus="false">
            <template v-slot:activator="{ on }">
              <v-btn link v-on="on" x-small text class="float-right" @click="editNote(note)">
                <v-icon x-small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-card @submit.prevent="onSubmit(note)">
              <v-card-title class="headline grey lighten-2" primary-title>Редактировать заметку</v-card-title>
              <v-card-text>
                <v-form class="px-3" ref="form">
                  <v-text-field
                    label="Название"
                    v-model="nameOfNote"
                    :class="{invalid: $v.nameOfNote.$dirty && !$v.nameOfNote.required}"
                  ></v-text-field>
                  <v-textarea
                    auto-grow
                    label="Содержание"
                    rows="4"
                    row-height="30"
                    v-model="descOfNote"
                    :class="{invalid: $v.descOfNote.$dirty && !$v.descOfNote.required}"
                  ></v-textarea>
                  <v-btn class="mx-3 mt-3" color="success" type="submit">Сохранить</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1 text-center" v-text="note.nameOfNote"></v-list-item-title>
              <v-list-item-subtitle class="text-center" v-text="note.descOfNote"></v-list-item-subtitle>
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
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  components: {
    LeftPanel
  },
  props: ['id'],
  data: () => ({
    current: null,
    dialog: false,
    nameOfNote: "",
    descOfNote: ""
  }),
  computed: {
    ...mapGetters(["groups"]),
    notes() {
      if(!this.groups) return;
      const group = this.groups.find(g => g.id === this.id)
      const notes = group.notes ? Object.keys(group.notes).map(key => ({
        ...group.notes[key],
        id: key
      })).filter(note => {
        return !note.deleted
      }) : [];
      return notes
    }
  },
  validations: {
    nameOfNote: { required },
    descOfNote: { required }
  },
  async mounted() {
    this.$store.dispatch("fetchGroups");
  },
  methods: {
    editNote(note) {
      this.current = note.id;
      this.nameOfNote = note.nameOfNote;
      this.descOfNote = note.descOfNote;
    },
    removeNote(note) {
      this.$store.dispatch("deleteNoteGroup", {
        id: this.id,
        key: note.id
      });
    },
    async onSubmit(note) {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.$store.dispatch("updateNoteGroup", {
          id: this.id,
          key: this.current,
          note: {
            nameOfNote: this.nameOfNote,
            descOfNote: this.descOfNote
          }
        });
        this.dialog = false;
      } catch (e) {}
    }
  }
};
</script>
