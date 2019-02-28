<template>
  <v-list-tile :to="'/member?id=' + member.id">
    <v-list-tile-avatar size="96" color="grey darken-4">
      <app-image :src="`/img/members/${member.id}_96x96.pnga`" />
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title v-text="member.name_ja" />
      <v-list-tile-sub-title>
        <p class="my-2">{{ member.group.name_ja }}</p>
        <p>{{ member.description }}</p>
      </v-list-tile-sub-title>
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
div >>> .v-list__tile {
  height: 132px;
}
.v-list__tile__avatar {
  min-width: 112px;
}
.v-list__tile__sub-title > p:last-child {
  white-space: initial;
  -webkit-line-clamp: 2;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
