<template>
  <v-container full-height pa-0>
    <v-layout column>
      <v-card>
        <v-list avatar>
          <v-list-tile>
            <v-list-tile-avatar color="grey darken-4">
              <v-img :src="src" contain />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="title" />
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content
              :class="{ 'grey--text': !schedule.description }"
            >
              <v-list-tile-title v-text="schedule.description || '詳細'" />
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ datetime }} -</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :href="url">
            <v-list-tile-content :class="{ 'grey--text': !url }">
              <v-list-tile-title v-text="url || 'URL'" />
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
    datetime() {
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
      if (!this.schedule.owner) {
        return
      }
      return (
        'https://www.youtube.com/channel/' +
        this.schedule.owner.youtube.channel_id +
        '/live'
      )
    }
  }
}
</script>
