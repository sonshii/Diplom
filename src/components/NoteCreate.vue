<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-list-item link v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-text-box-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Новая заметка</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card @submit.prevent="onSubmit">
      <v-card-title class="headline grey lighten-2" primary-title>Создать заметку</v-card-title>
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
          <v-btn class="mx-3 mt-3" color="success" type="submit">Создать</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
/*eslint-disable */
import { required } from "vuelidate/lib/validators";
export default {
  data: () => ({
    dialog: false,
    nameOfNote: "",
    descOfNote: ""
  }),
  props: ['group'],
  validations: {
    nameOfNote: { required },
    descOfNote: { required }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        if(this.group) {
          const note = await this.$store.dispatch("createNoteGroup", {
            id: this.group,
            note: {
              nameOfNote: this.nameOfNote,
              descOfNote: this.descOfNote
            }
          });
        } else {
          const note = await this.$store.dispatch("createNote", {
            nameOfNote: this.nameOfNote,
            descOfNote: this.descOfNote
          });
        }
        this.nameOfNote = "";
        this.descOfNote = "";
        this.$v.$reset();
        this.$emit("created", note);
        this.dialog = false
      } catch (e) {}
    }
  }
};
</script>
