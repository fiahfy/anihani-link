<template>
  <v-container full-height pa-0>
    <v-list two-line>
      <v-list-tile avatar :to="to">
        <v-list-tile-avatar size="48" color="grey darken-4">
          <app-image :src="src" contain />
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title v-text="title" />
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Start</v-list-tile-sub-title>
          <v-list-tile-title>
            <v-layout align-center>
              <span>{{ startedAt }}</span>
              <span
                v-if="live"
                class="live primary--text caption ml-2 text-uppercase"
              >
                Live Now
              </span>
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-if="url" :href="url">
        <v-list-tile-content>
          <v-list-tile-sub-title>URL</v-list-tile-sub-title>
          <v-list-tile-title v-text="url" />
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-if="event.description" class="description">
        <v-list-tile-content>
          <v-list-tile-sub-title>Description</v-list-tile-sub-title>
          <v-list-tile-title v-text="event.description" />
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-container>
</template>

<script>
import AppImage from '~/components/AppImage.vue'

export default {
  components: {
    AppImage
  },
  data() {
    return {
      timer: null,
      date: new Date()
    }
  },
  watchQuery: ['id'],
  computed: {
    live() {
      const endedAt = this.event.started_at.toDate()
      endedAt.setHours(endedAt.getHours() + 1)
      return this.event.started_at.toDate() < this.date && endedAt > this.date
    },
    to() {
      return this.event.owner ? '/member?id=' + this.event.owner.id : null
    },
    src() {
      return this.event.owner
        ? `/img/members/${this.event.owner.id}_48x48.png`
        : `/img/groups/${this.event.group.id}_113x48.png`
    },
    title() {
      return this.event.owner ? this.event.owner.name_ja : this.event.title
    },
    startedAt() {
      return this.event.started_at
        .toDate()
        .toLocaleString(window.navigator.language, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
          minute: 'numeric',
          hour12: false
        })
    },
    url() {
      if (this.event.url) {
        return this.event.url
      }
      if (this.event.owner) {
        return (
          'https://www.youtube.com/channel/' +
          this.event.owner.youtube.channel_id +
          '/live'
        )
      }
      return null
    }
  },
  async asyncData({ error, query, store }) {
    const { id } = query
    const event = await store.dispatch('event/fetchEvent', { id })
    if (!event) {
      return error({ statusCode: 404, message: 'Event not found' })
    }
    return { event }
  },
  created() {
    this.timer = setInterval(() => {
      this.date = new Date()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.v-list__tile__avatar {
  min-width: 64px;
}
.live {
  border: 1px solid var(--v-primary-base);
  padding: 1px 4px;
  line-height: 14px;
  box-sizing: content-box;
}
.description {
  padding-top: 14px;
  padding-bottom: 14px;
}
.description >>> .v-list__tile {
  height: unset;
}
.description >>> .v-list__tile .v-list__tile__title {
  height: unset;
  white-space: unset;
}
</style>
