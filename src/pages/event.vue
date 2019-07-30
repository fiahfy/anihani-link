<template>
  <v-container class="pa-0">
    <v-list two-line>
      <v-list-item :to="to">
        <v-list-item-avatar size="48" color="grey darken-4">
          <app-image :src="src" contain />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="owner" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>Start</v-list-item-subtitle>
          <v-list-item-title>
            <v-row class="px-3" align="center" justify="space-between">
              <span>{{ startedAt }}</span>
              <span
                v-if="live"
                class="live primary--text caption ml-2 text-uppercase"
              >
                Live Now
              </span>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="url" :href="url">
        <v-list-item-content>
          <v-list-item-subtitle>URL</v-list-item-subtitle>
          <v-list-item-title v-text="url" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="event.title">
        <v-list-item-content>
          <v-list-item-subtitle>Title</v-list-item-subtitle>
          <v-list-item-title v-text="event.title" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="description" class="description">
        <v-list-item-content>
          <v-list-item-subtitle>Description</v-list-item-subtitle>
          <!-- eslint-disable vue/no-v-html -->
          <v-list-item-title v-html="description" />
          <!-- eslint-enable vue/no-v-html -->
        </v-list-item-content>
      </v-list-item>
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
      now: new Date()
    }
  },
  watchQuery: ['id'],
  computed: {
    live() {
      const endedAt = this.event.started_at.toDate()
      endedAt.setHours(endedAt.getHours() + 1)
      return this.event.started_at.toDate() < this.now && endedAt > this.now
    },
    to() {
      return this.event.owner ? '/member?id=' + this.event.owner.id : null
    },
    src() {
      return this.event.owner
        ? `/img/members/${this.event.owner.id}_48x48.png`
        : `/img/groups/${this.event.group.id}_113x48.png`
    },
    owner() {
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
    },
    description() {
      return this.$options.filters.nl2br(
        this.$options.filters.url2anchor(this.event.description)
      )
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
      this.now = new Date()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.v-list-item__avatar {
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
.description >>> .v-list-item {
  height: unset;
}
.description >>> .v-list-item .v-list-item__title {
  height: unset;
  white-space: unset;
}
</style>
