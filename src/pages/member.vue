<template>
  <v-container pa-0>
    <v-layout row wrap pa-3>
      <v-flex md4 sm6 xs12>
        <v-layout row wrap align-center pa-3>
          <v-flex xs12 pa-3 text-xs-center>
            <v-avatar size="192" color="grey darken-4">
              <v-img :src="`/img/members/${member.id}_96x96.png`">
                <v-layout
                  slot="placeholder"
                  fill-height
                  align-center
                  justify-center
                >
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-layout>
              </v-img>
            </v-avatar>
          </v-flex>
          <v-flex xs12 pa-3 text-xs-center title v-text="member.name_ja" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <v-flex xs12 pa-3 text-xs-center caption v-html="description" />
          <v-flex xs12 pa-3 text-xs-left>
            <v-layout pa-1 align-center>
              <img src="/img/twitter-logo.svg" height="30" class="mr-2" />
              <a
                class="caption ellipsis text-decoration-none"
                :href="`https://twitter.com/${member.twitter.screen_name}`"
                v-text="`twitter.com/${member.twitter.screen_name}`"
              />
            </v-layout>
            <v-layout pa-1 align-center>
              <img src="/img/youtube-logo.png" height="16" class="px-1 mr-2" />
              <a
                class="caption ellipsis text-decoration-none"
                :href="
                  `https://www.youtube.com/channel/${member.youtube.channel_id}`
                "
                v-text="`www.youtube.com/channel/${member.youtube.channel_id}`"
              />
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex md8 sm6 xs12>
        <schedule-list v-if="schedules.length" :schedules="schedules" />
        <v-layout v-else align-center justify-center column>
          <p class="subheading">No Schedules</p>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleList from '~/components/ScheduleList.vue'

export default {
  components: {
    ScheduleList
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
      return this.member.description
        .replace(/。/g, '。\n')
        .replace(/\n+/g, '<br />')
    }
  }
}
</script>
