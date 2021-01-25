import Vue from "vue";
import App from "./App.vue";
import Vuelidate from "vuelidate";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import router from "./routes";
import store from "./store";
Vue.use(VueRouter);
import "../css/style.css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;
Vue.use(Vuelidate);

firebase.initializeApp({
  apiKey: "AIzaSyCIDLut1vGzzNYOPxfi2Sse8Yhz0akf7M0",
  authDomain: "diplom-note-app.firebaseapp.com",
  databaseURL: "https://diplom-note-app.firebaseio.com",
  projectId: "diplom-note-app",
  storageBucket: "diplom-note-app.appspot.com",
  messagingSenderId: "862049982151",
  appId: "1:862049982151:web:95afa3479d0dd44f33d0e2",
  measurementId: "G-89VRW3WPG9"
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      vuetify,
      render: h => h(App),
      router,
      store
    }).$mount("#app");
  }
});
