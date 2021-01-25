<template>
  <div class="main-page-wrapper col-lg-12 d-flex">
    <left-panel @sendToParent="sendToParent" />
    <div
      class="main-content d-flex justify-center align-center flex-column col-lg-12"
      v-if="this.notes.length < 1"
    >
      <img src="../../img/edit.svg" class="background-svg" />
      <h2 class="head mt-5 font-italic font-weight-light">У вас нет заметок</h2>
    </div>
    <div
      class="d-flex align-start flex-wrap flex-row justify-between"
      v-else-if="this.notes.length > 0"
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
export default {
  components: {
    LeftPanel
  },
  data: () => ({
    label: true,
    current: null,
    notes: [],
    dialog: false,
    nameOfNote: "",
    descOfNote: ""
  }),
  validations: {
    nameOfNote: { required },
    descOfNote: { required }
  },
  methods: {
    sendToParent(data) {
      this.notes = data;
    },
    editNote(note) {
      this.current = note.id;
      this.nameOfNote = note.nameOfNote;
      this.descOfNote = note.descOfNote;
    },
    removeNote(note) {
      this.current = note.id;
      this.$store.dispatch("deleteNote", {
        id: this.current
      });
      this.notes.splice(this.notes.indexOf(note), 1);
      if (this.notes.length === 0) {
        this.label = true;
      }
    },
    async onSubmit(note) {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.$store.dispatch("updateNote", {
          id: this.current,
          nameOfNote: this.nameOfNote,
          descOfNote: this.descOfNote
        });
        this.dialog = false;
        const index = this.notes.findIndex(note => note.id === this.current);
        this.notes[index].nameOfNote = this.nameOfNote;
        this.notes[index].descOfNote = this.descOfNote;
      } catch (e) {}
    }
  }
};
</script>