<template>
  <div class="main-page-wrapper col-lg-12 d-flex">
    <left-panel/>
    <div class="main-content d-flex justify-center align-center flex-column col-lg-12" v-if="!abstracts || abstracts.length < 1">
      <img src="../../img/contract.svg" class="background-svg сol-lg-5 сol-md-5 сol-sm-5" />
      <h2 class="head mt-5 font-italic font-weight-light сol-lg-5">В группе нет конспектов</h2>
    </div>
    <div class="d-flex align-start flex-wrap flex-row justify-between" v-else>
      <v-col v-for="(abstract) in abstracts" :key="abstract.id" :value="abstract.id">
        <v-card class="mx-auto leather" width="200" height="300">
          <v-btn text x-small @click="removeAbstract(abstract)">
            <v-icon x-small>mdi-close-thick</v-icon>
          </v-btn>
          <v-list-item three-line :to="'/MyGroup/' + id + '/Abstracts/' + abstract.id">
            <v-list-item-content>
              <v-list-item-title class="text-center qq" v-text="abstract.nameOfAbstract"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </div>
  </div>
</template>
<script>
import LeftPanel from "../components/LeftPanel";
import { mapGetters } from "vuex";
export default {
  components: {
    LeftPanel
  },
  props: ['id'],
  data: () => ({
    hrefToEdit: "/AbsEdit",
    currentAbs: null,
    nameOfAbstract: "",
    descOfAbstract: ""
  }),
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
    this.$store.dispatch("fetchGroups");
  },
  methods: {
    removeAbstract(abstract) {
      this.$store.dispatch("deleteAbstractGroup", {
        id: this.id,
        key: abstract.id
      });
    },
    editAbstract(abstract) {
      this.$store.state.currentAbs = abstract.id;
      this.$store.state.nameOfAbstract = abstract.nameOfAbstract;
      this.$store.state.descOfAbstract = abstract.descOfAbstract;
    }
  }
};
</script>
