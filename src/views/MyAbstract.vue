<template>
  <div class="main-page-wrapper col-lg-12 d-flex">
    <left-panel @sendToParent2="sendToParent2" />
    <div class="main-content d-flex justify-center align-center flex-column col-lg-12" v-if="label">
      <img src="../../img/contract.svg" class="background-svg сol-lg-5 сol-md-5 сol-sm-5" />
      <h2 class="head mt-5 font-italic font-weight-light сol-lg-5">У вас нет конспектов</h2>
    </div>
    <div class="d-flex align-start flex-wrap flex-row justify-between" v-else>
      <v-col v-for="(abstract) in abstracts" :key="abstract.id" :value="abstract.id">
        <v-card class="mx-auto leather" width="200" height="300">
          <v-btn text x-small @click="removeAbstract(abstract)">
            <v-icon x-small>mdi-close-thick</v-icon>
          </v-btn>
          <v-list-item three-line @click="editAbstract(abstract)">
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
export default {
  components: {
    LeftPanel
  },
  data: () => ({
    label: true,
    abstracts: [],
    hrefToEdit: "/AbsEdit",
    currentAbs: null,
    nameOfAbstract: "",
    descOfAbstract: ""
  }),
  methods: {
    sendToParent2(data) {
      this.abstracts = data;
      if (this.abstracts.length > 0) {
        this.label = false;
      }
    },
    removeAbstract(abstract) {
      this.currentAbs = abstract.id;
      this.$store.dispatch("deleteAbstract", {
        id: this.currentAbs
      });
      this.abstracts.splice(this.abstracts.indexOf(abstract), 1);
      if (this.abstracts.length === 0) {
        this.label = true;
      }
    },
    editAbstract(abstract) {
      this.$store.state.currentAbs = abstract.id;
      this.$store.state.nameOfAbstract = abstract.nameOfAbstract;
      this.$store.state.descOfAbstract = abstract.descOfAbstract;
      this.$router.push(this.hrefToEdit);
    }
  }
};
</script>
