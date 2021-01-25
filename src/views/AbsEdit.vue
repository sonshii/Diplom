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
        <v-btn class="mx-3 mt-3" color="success" type="submit">Сохранить</v-btn>
        <v-btn class="mx-3 mt-3" color="error" :to="id ? '/MyGroup/' + id + '/Abstracts' : hrefToBack">Назад</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
/*eslint-disable*/
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  data: () => ({
    hrefToBack: "/MyAbstract",
    nameOfAbstract: "",
    descOfAbstract: "",
    currentAbs: null
  }),
  props: ['id', 'aid'],
  validations: {
    nameOfAbstract: { required },
    descOfAbstract: { required }
  },
  computed: {
    ...mapGetters(["groups"]),
    abstracts() {
      if(!this.groups) return;
      const group = this.groups.find(g => g.id === this.id)
      const abstracts = group.abstracts ? Object.keys(group.abstracts).map(key => ({
        ...group.abstracts[key],
        id: key
      })).filter(abs => {
        return !abs.deleted
      }) : [];
      return abstracts
    }
  },
  async mounted() {
    if(this.id) await this.$store.dispatch("fetchGroups");
    this.sendToComp();
  },
  methods: {
    sendToComp() {
      if(this.id) {
        const abs = this.abstracts.find(a => a.id === this.aid)
        this.currentAbs = abs.id;
        this.nameOfAbstract = abs.nameOfAbstract;
        this.descOfAbstract = abs.descOfAbstract;
      } else {
        this.currentAbs = this.$store.state.currentAbs;
        this.nameOfAbstract = this.$store.state.nameOfAbstract;
        this.descOfAbstract = this.$store.state.descOfAbstract;
      }
    },
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        if(this.id) {
          await this.$store.dispatch("updateAbstractGroup", {
            id: this.id,
            key: this.aid,
            abs: {
              nameOfAbstract: this.nameOfAbstract,
              descOfAbstract: this.descOfAbstract
            }
          });
        } else {
          await this.$store.dispatch("updateAbstract", {
            id: this.currentAbs,
            nameOfAbstract: this.nameOfAbstract,
            descOfAbstract: this.descOfAbstract
          });
        }
        this.$router.push(this.id ? '/MyGroup/' + this.id + '/Abstracts' : "/MyAbstract");
      } catch (e) {}
    }
  }
};
</script>
