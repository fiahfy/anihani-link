<template>
  <v-list-tile :to="'/member?id=' + member.id">
    <v-list-tile-avatar size="48" color="grey darken-4">
      <app-image :src="`/img/members/${member.id}_48x48.png`" />
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title v-text="member.name_ja" />
      <v-list-tile-sub-title v-text="member.group.name_ja" />
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import AppImage from '~/components/AppImage.vue'

export default {
  components: {
    AppImage
  },
  props: {
    member: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.v-list__tile__avatar {
  min-width: 64px;
}
.v-list__tile__content {
  /* padding-top: 10px; */
}
</style>
