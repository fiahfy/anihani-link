<template>
  <v-container fill-height pa-0>
    <v-layout column>
      <v-card>
        <v-img
          :src="`/img/members/${member.id}_500x700.png`"
          height="320"
          contain
          class="mt-3"
        />
        <v-card-title primary-title class="text-xs-center">
          <v-layout column>
            <div class="title mb-3" v-text="member.name_ja" />
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="grey--text" v-html="description" />
          </v-layout>
        </v-card-title>
      </v-card>

      <v-card>
        <v-list subheader>
          <v-subheader class="text-uppercase">Links</v-subheader>
          <v-list-tile
            :href="
              `https://www.youtube.com/channel/${member.youtube.channel_id}`
            "
          >
            <v-list-tile-action>
              <img src="/img/youtube-logo.png" height="16" class="px-1" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>YouTube</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            :href="`https://twitter.com/${member.twitter.screen_name}`"
          >
            <v-list-tile-action>
              <img src="/img/twitter-logo.svg" height="30" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Twitter</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>

      <schedule-card :schedules="schedules" />
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleCard from '~/components/ScheduleCard.vue'

export default {
  components: {
    ScheduleCard
  },
  watchQuery: ['id'],
  async asyncData({ error, query, store }) {
    const { id } = query
    const member = store.getters['member/getMember']({ id })
    if (!member) {
      return error({ statusCode: 404, message: 'Member Not Found' })
    }

    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const schedules = await store.dispatch('schedule/fetchSchedules', {
      startedAt,
      ownerId: member.id
    })
    return { member, schedules }
  },
  computed: {
    description() {
      return this.member.description.replace(/\n/g, '<br />')
    }
  }
}
</script>
