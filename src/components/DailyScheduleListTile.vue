<template>
  <v-list-tile avatar :to="'/schedule?id=' + schedule.id">
    <v-list-tile-avatar size="48" color="grey darken-4">
      <app-image :src="src" contain />
    </v-list-tile-avatar>

    <v-list-tile-content class="justify-start">
      <v-list-tile-title :class="{ 'font-weight-bold': highlighted }">
        <v-layout align-center>
          <span>{{ startedAt }} -</span>
          <span
            v-if="live"
            class="live primary--text caption ml-2 text-uppercase"
          >
            Live Now
          </span>
        </v-layout>
      </v-list-tile-title>
      <v-list-tile-sub-title>
        <span
          :class="{ 'text--primary': true, 'font-weight-bold': highlighted }"
          v-text="title"
        />
        {{ description }}
      </v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import { mapState } from 'vuex'
import AppImage from '~/components/AppImage.vue'

export default {
  components: {
    AppImage
  },
  props: {
    schedule: {
      type: Object,
      required: true
    }
  },
  computed: {
    live() {
      const endedAt = this.schedule.started_at.toDate()
      endedAt.setHours(endedAt.getHours() + 1)
      return (
        this.schedule.started_at.toDate().getTime() < this.now &&
        endedAt.getTime() > this.now
      )
    },
    highlighted() {
      const endedAt = this.schedule.started_at.toDate()
      endedAt.setHours(endedAt.getHours() + 1)
      return endedAt.getTime() > this.now
    },
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
    description() {
      return this.schedule.description ? ' — ' + this.schedule.description : ''
    },
    startedAt() {
      const d = this.schedule.started_at.toDate()
      return d.toLocaleTimeString(window.navigator.language, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
    },
    ...mapState(['now'])
  }
}
</script>

<style scoped>
.v-list__tile__avatar {
  min-width: 64px;
  margin-top: -12px;
}
.v-list__tile__content {
  padding-top: 10px;
}
.v-list__tile__sub-title {
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}
.live {
  border: 1px solid var(--v-primary-base);
  padding: 1px 4px;
  line-height: 14px;
  box-sizing: content-box;
}
</style>
