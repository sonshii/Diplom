<template>
  <v-list-item :to="group ? '/MyGroup/' + group + '/AbsCreate' : href">
    <v-list-item-icon>
      <v-icon>mdi-file-plus</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>Новый конспект</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
    props: ['group'],
    data: () => ({
        href: "/AbsCreate"
    })
};
</script>
