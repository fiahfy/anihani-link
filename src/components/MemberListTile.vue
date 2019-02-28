<template>
  <v-list-tile :to="'/member?id=' + member.id">
    <v-list-tile-avatar size="96" color="grey darken-4">
      <app-image
        :src="`/img/members/${member.id}_96x96.png`"
        :lazy-src="`/img/members/${member.id}_48x48.png`"
      />
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title v-text="member.name_ja" />
      <v-list-tile-sub-title>
        <p class="my-1">{{ member.group.name_ja }}</p>
        <p class="mb-0">{{ member.description }}</p>
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
  padding-left: 32px;
}
.v-list__tile__avatar {
  min-width: 128px;
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
