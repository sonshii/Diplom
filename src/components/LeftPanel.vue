<template>
  <div class="left-panel d-flex flex-column">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://sun9-29.userapi.com/c850608/v850608943/121897/lWYSNsMB0Js.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-title>{{name}} {{surname}}</v-list-item-title>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.href">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <hr />
        <v-list-item
          v-for="functional in functionals"
          :key="functional.title"
          link
          :to="functional.href"
        >
          <v-list-item-icon>
            <v-icon>{{ functional.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ functional.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <note-create @created="addNewNote" />
        <abstract-create />
        <v-list-item v-for="quit in quits" :key="quit.title" link @click.prevent="logout">
          <v-list-item-icon>
            <v-icon>{{ quit.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ quit.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import NoteCreate from "../components/NoteCreate";
import AbstractCreate from "../components/AbstractCreate";
export default {
  components: {
    NoteCreate,
    AbstractCreate
  },
  data() {
    return {
      dialog: false,
      drawer: true,
      notes: [],
      abstracts: [],
      items: [
        { title: "Недавние", icon: "mdi-clock-outline", href: "/" },
        { title: "Мои группы", icon: "mdi-account-group", href: "/MyGroup" },
        { title: "Мои заметки", icon: "mdi-calendar-text", href: "/MyNotes" },
        {
          title: "Мои конспекты",
          icon: "mdi-file-document",
          href: "/MyAbstract"
        },
        { title: "Поиск", icon: "mdi-magnify" }
      ],
      functionals: [
        {
          title: "Новая группа",
          icon: "mdi-account-multiple-plus",
          href: "/NewGroupCreate"
        }
      ],
      quits: [{ title: "Выйти", icon: "mdi-exit-to-app", href: "/SignIn" }],
      mini: true
    };
  },

  async mounted() {
    this.notes = await this.$store.dispatch("fetchNotes");
    this.abstracts = await this.$store.dispatch("fetchAbstracts");
    this.sendToParent();
    this.sendToParent2()
  },

  computed: {
    name() {
      return this.$store.getters.info.name;
    },
    surname() {
      return this.$store.getters.info.surname;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/SignIn");
    },
    addNewNote(note) {
      this.notes.push(note)
    },
    addNewAbstract(abstract){
      this.abstracts.push(abstract)
    },
    sendToParent(){
      this.$emit("sendToParent", this.notes)
    },
    sendToParent2(){
      this.$emit("sendToParent2", this.abstracts)
    }
  }
};
</script>
