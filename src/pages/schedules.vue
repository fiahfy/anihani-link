<template>
  <v-container full-height pa-0>
    <v-layout column>
      <v-card>
        <v-list two-line>
          <v-list-tile avatar>
            <v-list-tile-avatar size="48" color="grey darken-4">
              <v-img :src="src" contain />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="title" />
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-sub-title>Start Time</v-list-tile-sub-title>
              <v-list-tile-title>
                <span>{{ startedAt }}</span>
                <span
                  v-if="live"
                  class="live primary--text caption ml-2 text-uppercase"
                >
                  Live Now
                </span>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="url" :href="url">
            <v-list-tile-content>
              <v-list-tile-sub-title>URL</v-list-tile-sub-title>
              <v-list-tile-title v-text="url" />
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="schedule.description" class="description">
            <v-list-tile-content>
              <v-list-tile-sub-title>Description</v-list-tile-sub-title>
              <v-list-tile-title v-text="schedule.description" />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  watchQuery: ['id'],
  async asyncData({ error, query, store }) {
    const { id } = query
    const schedule = await store.dispatch('schedule/fetchSchedule', { id })
    if (!schedule) {
      return error({ statusCode: 404, message: 'Schedule Not Found' })
    }
    if (schedule.owner) {
      const member = await store.dispatch('member/fetchMember', {
        id: schedule.owner.id
      })
      schedule.owner = { ...member, id: schedule.owner.id }
    }
    return { schedule }
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
      return this.schedule.started_at
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
      if (this.schedule.url) {
        return this.schedule.url
      }
      if (this.schedule.owner) {
        return (
          'https://www.youtube.com/channel/' +
          this.schedule.owner.youtube.channel_id +
          '/live'
        )
      }
      return null
    }
  }
}
</script>

<style scoped>
.v-list__tile__avatar {
  min-width: 64px;
}
.v-list__tile__title {
  vertical-align: bottom;
}
.v-list__tile__title > * {
  vertical-align: bottom;
}
.live {
  border: 1px solid var(--v-primary-base);
  padding: 1.5px 4px;
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
