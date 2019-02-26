<template>
  <v-container pa-0>
    <v-layout row wrap :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
      <v-flex md4 sm6 xs12>
        <v-layout row wrap align-center pa-3>
          <v-flex xs12 pa-3 text-xs-center>
            <v-avatar size="192" color="grey darken-4">
              <app-image
                :src="`/img/members/${member.id}_192x192.png`"
                :lazy-src="`/img/members/${member.id}_48x48.png`"
              >
                <v-layout
                  slot="placeholder"
                  fill-height
                  align-center
                  justify-center
                >
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-layout>
              </app-image>
            </v-avatar>
          </v-flex>
          <v-flex xs12 pa-3 text-xs-center title v-text="member.name_ja" />
          <!-- eslint-disable vue/no-v-html -->
          <v-flex
            xs12
            pa-3
            text-xs-center
            caption
            v-html="$options.filters.nl2br(member.description)"
          />
          <!-- eslint-enable vue/no-v-html -->
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
        <v-list subheader>
          <v-subheader class="subheading text-uppercase">Schedule</v-subheader>
          <v-divider />
        </v-list>
        <template v-if="dailyEvents.length">
          <daily-event-list
            v-for="(dailyEvent, index) of dailyEvents"
            :key="index"
            :date="dailyEvent.date"
            :events="dailyEvent.events"
          />
        </template>
        <v-list v-else>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title class="body-1 text-xs-center">
                No Events
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AppImage from '~/components/AppImage.vue'
import DailyEventList from '~/components/DailyEventList.vue'

export default {
  components: {
    AppImage,
    DailyEventList
  },
  watchQuery: ['id'],
  async asyncData({ error, query, store }) {
    const { id } = query
    const member = store.getters['member/getMember']({ id })
    if (!member) {
      return error({ statusCode: 404, message: 'Member not found' })
    }

    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const dailyEvents = await store.dispatch('event/fetchDailyEvents', {
      startedAt,
      ownerId: member.id
    })
    return { member, dailyEvents }
  }
}
</script>
