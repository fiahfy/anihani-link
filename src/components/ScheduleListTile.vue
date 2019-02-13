<template>
  <v-list-tile avatar>
    <v-list-tile-avatar size="48" color="grey darken-4">
      <img :src="src" />
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-sub-title>{{ startedAt }} - </v-list-tile-sub-title>
      <v-list-tile-title>
        <span v-text="title" />
        <span class="caption ml-1" v-text="schedule.description" />
      </v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
export default {
  props: {
    schedule: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    src() {
      return this.schedule.owner
        ? `/img/members/${this.schedule.owner.id}_96x96.png`
        : `/img/groups/${this.schedule.group.id}_226x96.png`
    },
    title() {
      return this.schedule.owner
        ? this.schedule.owner.name_ja
        : this.schedule.title
    },
    startedAt() {
      const d = this.schedule.started_at.toDate()
      return d.toLocaleTimeString(window.navigator.language, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
    }
  }
}
</script>

<style scoped>
.v-avatar > img {
  object-fit: contain;
}
</style>
