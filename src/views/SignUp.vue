<template>
  <div class="signUp d-flex flex-column align-center justify-center">
    <v-row align="center">
      <v-col cols="12" lg="12" md="12" sm="12">
        <form class="signUp__form d-flex flex-column" @submit.prevent="onSubmit">
          <h2>Создание аккаунта</h2>
          <div class="name d-flex flex-row flex-lg-row flex-md-row flex-sm-column justify-start">
            <div class="d-flex flex-column col-lg-6">
              <label for="name">Имя</label>
              <input
                type="text"
                id="name"
                v-model.trim="name"
                :class="{invalid: $v.name.$dirty && !$v.name.required}"
              />
            </div>
            <div class="d-flex flex-column col-lg-6">
              <label for="surname">Фамилия</label>
              <input
                type="text"
                id="surname"
                v-model.trim="surname"
                :class="{invalid: $v.surname.$dirty && !$v.surname.required}"
              />
            </div>
          </div>
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
                v-model.trim="pass"
                :class="{invalid: ($v.pass.$dirty && !$v.pass.required) || ($v.pass.$dirty && !$v.pass.minLength)}"
              />
            </div>
          </div>
          <div class="d-flex justify-start">
            <div class="d-flex flex-column col-lg-12">
              <label for="confpassword">Подтверждение пароля</label>
              <input type="password" id="confpassword" v-model.trim="confpass" />
            </div>
          </div>
          <div class="d-flex justify-start">
            <v-btn
              medium
              color="success"
              class="col-lg-12 mt-7"
              rounded
              type="submit"
            >Создать аккаунт</v-btn>
          </div>
        </form>
        <div class="mt-7 d-flex justify-center flex-column align-center">
          <h3>Уже зарегистрированы?</h3>
          <v-btn large color="primary" text :to="hrefToSignIn">Войти</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
/*eslint-disable */
import { email, required, minLength, sameAs } from "vuelidate/lib/validators";
import messages from '../utils/messages'
export default {
  data: () => ({
    hrefToSignIn: "/SignIn",
    email: "",
    pass: "",
    confpass: "",
    name: "",
    surname: ""
  }),
  validations: {
    email: { email, required },
    pass: { required, minLength: minLength(6) },
    confpass: { required, sameAsPassword: sameAs("pass") },
    name: { required },
    surname: { required }
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
        name: this.name,
        surname: this.surname,
        email: this.email,
        pass: this.pass,
        confpass: this.confpass
      };
      try {
        await this.$store.dispatch("register", formData);
        this.$router.push("/");
      } catch(e){}
    }
  }
};
/*eslint-enable */
</script>
    