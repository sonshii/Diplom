<template>

  <v-card @submit.prevent="onSubmit">
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          class="display-1"
          placeholder="Наименование предмета"
          v-model="nameOfAbstract"
          :class="{invalid: $v.nameOfAbstract.$dirty && !$v.nameOfAbstract.required}"
        ></v-text-field>
        <v-textarea
          auto-grow
          rows="4"
          row-height="180"
          class="body-1"
          placeholder="Содержание конспекта"
          v-model="descOfAbstract"
          :class="{invalid: $v.descOfAbstract.$dirty && !$v.descOfAbstract.required}"
        ></v-textarea>
        <br />
        <v-btn class="mx-3 mt-3" color="success" type="submit">Создать</v-btn>
        <v-btn class="mx-3 mt-3" color="error" :to="id ? '/MyGroup/' + id : hrefToBack">Назад</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
/*eslint-disable*/
import { required } from "vuelidate/lib/validators";
import LeftPanel from "../components/LeftPanel";
export default {
  components: {
    LeftPanel
  },
  props: ['id'],
  data: () => ({
    hrefToBack: "/",
    nameOfAbstract: "",
    descOfAbstract: ""
  }),
  validations: {
    nameOfAbstract: { required },
    descOfAbstract: { required }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        if(this.id) {
          const abstract = await this.$store.dispatch("createAbstractGroup", {
            id: this.id,
            abs: {
              nameOfAbstract: this.nameOfAbstract,
              descOfAbstract: this.descOfAbstract
            }
          });
        } else {
          const abstract = await this.$store.dispatch("createAbstract", {
            nameOfAbstract: this.nameOfAbstract,
            descOfAbstract: this.descOfAbstract
          });
        }
        this.nameOfAbstract = "";
        this.descOfAbstract = "";
        this.$v.$reset();
        this.$router.push(this.id ? '/MyGroup/' + this.id + '/Abstracts' : "/MyAbstract");
      } catch (e) {}
    }
  }
};
</script>
