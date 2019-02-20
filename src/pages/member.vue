<template>
  <v-container fill-height pa-0>

        <v-card>
    <v-layout row wrap pa-0>
      <v-flex md4 xs12 px-3>
        <v-layout row wrap align-center>
          <v-flex xs12 py-3 text-xs-center>
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
          <v-flex xs12 py-3 text-xs-center title v-text="member.name_ja" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <v-flex xs12 py-3 text-xs-center caption v-html="description" />
          <v-flex xs12 py-3 text-xs-left>
            <v-layout pb-2 align-center>
              <img src="/img/twitter-logo.svg" height="30" />
              <a
                class="caption ellipsis ml-2"
                :href="`https://twitter.com/${member.twitter.screen_name}`"
                v-text="`twitter.com/${member.twitter.screen_name}`"
              />
            </v-layout>
            <v-layout pb-2 align-center>
              <img src="/img/youtube-logo.png" height="16" class="px-1" />
              <a
                class="caption ellipsis ml-2"
                :href="
                  `https://www.youtube.com/channel/${member.youtube.channel_id}`
                "
                v-text="`www.youtube.com/channel/${member.youtube.channel_id}`"
              />
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex md8 xs12>
          <schedule-list v-if="schedules.length" :schedules="schedules" />
      </v-flex>
    </v-layout>
    </v-card>
    <!-- <v-layout column>
      <v-card>
        <v-img
          :src="`/img/members/${member.id}_500x700.png`"
          height="320"
          contain
          class="mt-3"
        >
          <v-layout
            slot="placeholder"
            fill-height
            align-center
            justify-center
            ma-0
          >
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-layout>
        </v-img>

        <v-card-title primary-title class="text-xs-center">
          <v-layout column>
            <div class="title mb-3" v-text="member.name_ja" />
            --><!-- eslint-disable-next-line vue/no-v-html --><!--
            <span class="grey--text" v-html="description" />
          </v-layout>
        </v-card-title>

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

        <schedule-list v-if="schedules.length" :schedules="schedules" />
        <div v-else class="pb-3 grey--text text-xs-center">No Schedules</div>
      </v-card>
    </v-layout> -->
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
