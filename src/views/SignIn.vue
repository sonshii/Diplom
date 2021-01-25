<template>
  <div class="signUp d-flex flex-column align-center justify-center">
    <v-row align="center">
      <v-col cols="12" lg="12" md="12" sm="12">
        <form class="signUp__form d-flex flex-column" @submit.prevent="onSubmit">
          <h2>Вход</h2>
          <div class="d-flex justify-start">
            <div class="d-flex flex-column col-lg-12">
              <label for="email">E-mail</label>
              <input
                type="email"
                id="email"
                v-model.trim="email"
                :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
              />
            </div>
          </div>
          <div class="d-flex justify-start">
            <div class="d-flex flex-column col-lg-12">
              <label for="password">Пароль</label>
              <input
                type="password"
                id="password"
                v-model="pass"
                :class="{invalid: ($v.pass.$dirty && !$v.pass.required) || ($v.pass.$dirty && !$v.pass.minLength)}"
              />
            </div>
          </div>
          <div class="d-flex justify-start">
            <v-btn medium color="success" class="col-lg-12 mt-7" rounded type="submit">Войти</v-btn>
          </div>
        </form>
        <div class="mt-7 d-flex justify-center flex-column align-center">
          <h3>Ещё не зарегистрированы?</h3>
          <v-btn large color="primary" text :to="hrefToSignUp">Создать аккаунт</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
/*eslint-disable */

import { email, required, minLength } from "vuelidate/lib/validators";
import messages from '../utils/messages'
export default {
  data: () => ({
    hrefToSignUp: "/SignUp",
    email: "",
    pass: ""
  }),
  validations: {
    email: { email, required },
    pass: { required, minLength: minLength(6) }
  },
  computed:{
    error(){
      return this.$store.getters.error
    }
  },
  watch:{
    error(fbError){
      console.log(fbError),
      alert(messages[fbError.code] || "Ошибка")
    }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = {
        email: this.email,
        pass: this.pass
      };
      try {
        await this.$store.dispatch("login", formData);
        this.$router.push("/");
      } catch (e) {}
    }
  }
};
/*eslint-enable */
</script>


    