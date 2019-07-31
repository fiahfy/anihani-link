<template>
  <v-list-item :to="'/member?id=' + member.id">
    <v-list-item-avatar size="96" color="grey darken-4">
      <app-image
        :src="`/img/members/${member.id}_96x96.png`"
        :lazy-src="`/img/members/${member.id}_48x48.png`"
      />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-text="member.name_ja" />
      <v-list-item-subtitle>
        <p class="my-2">{{ member.group.name_ja }}</p>
        <p class="mb-0">{{ member.description }}</p>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
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
div >>> .v-list-item {
  height: 132px;
  padding-left: 32px;
}
.v-list-item__avatar {
  min-width: 128px;
}
.v-list-item__subtitle > p:last-child {
  white-space: initial;
  -webkit-line-clamp: 2;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
