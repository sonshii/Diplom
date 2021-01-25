<template>
  <div class="main-page-wrapper col-lg-12 d-flex">
    <left-panel />
    <div class="main-content d-flex justify-center align-center flex-column col-lg-12">
      <img src="../../img/work.svg" class="background-svg" />
      <h2
        class="head mt-5 font-italic font-weight-light text-center"
      >Здесь появляются заметки и конспекты, которые вы <br> недавно создали</h2>
    </div>
  </div>
</template>

<script>
import LeftPanel from "../components/LeftPanel";
export default {
  components: {
    LeftPanel
  },
  async mounted() {
    if (this.$store.getters.info) {
      await this.$store.dispatch("fetchInfo");
    }
  }
};
</script>