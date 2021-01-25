<template>

  <div class="signUp d-flex flex-column align-center ">
    <nav class="navbar mb-8 d-flex flex-row align-center ">
      <v-btn small color="normal" text class="back" :to="hrefToHome"><v-icon small>mdi-arrow-left</v-icon>Назад</v-btn>
    </nav>
    <h2 class="mb-8">Новая группа</h2>
    <v-form class="signUp__form d-flex flex-column col-lg-4" ref="form">
      <div class="d-flex justify-start">
        <div class="d-flex flex-column col-lg-12">
          <label for="name">Название группы</label>
          <input type="text" id="name"
                 v-model="nameOfGroup"
                 :class="{invalid: $v.nameOfGroup.$dirty && !$v.nameOfGroup.required}"/>
        </div>
      </div>
      <div class="d-flex justify-space-around">
        <v-btn medium color="success" class="col-lg-4 mt-7" rounded @click="saveGroup">Создать</v-btn>
        <v-btn medium color="error" class="col-lg-4 mt-7" rounded :to="hrefToHome">Отменить</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
/*eslint-disable*/
import { required } from "vuelidate/lib/validators";
import LeftPanel from "../components/LeftPanel";
export default {
  components: {
    LeftPanel
  },
  data: () => ({
    hrefToHome: '/',
    nameOfGroup: ''
  }),
  validations: {
    nameOfGroup: { required }
  },
  async mounted() {
    this.$store.dispatch("fetchUsers");
  },
  methods: {
    async saveGroup() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const group = await this.$store.dispatch("createGroup", {
          nameOfGroup: this.nameOfGroup
        });
        this.nameOfGroup = "";
        this.$v.$reset();
        this.$router.push("/MyGroup");
      } catch (e) {}
    }
  }
};
</script>
