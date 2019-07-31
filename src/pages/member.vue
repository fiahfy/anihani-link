<template>
  <v-container class="pa-0">
    <v-row :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
      <v-col md="4" sm="6" cols="12">
        <v-row class="pa-3" align="center">
          <v-col class="pa-3 text-center" cols="12">
            <v-avatar size="192" color="grey darken-4">
              <app-image
                :src="`/img/members/${member.id}_192x192.png`"
                :lazy-src="`/img/members/${member.id}_48x48.png`"
              >
                <v-row
                  slot="placeholder"
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row>
              </app-image>
            </v-avatar>
          </v-col>
          <v-col
            class="pa-3 text-center title"
            cols="12"
            v-text="member.name_ja"
          />
          <!-- eslint-disable vue/no-v-html -->
          <v-col
            class="pa-3 text-center caption"
            cols="12"
            v-html="$options.filters.nl2br(member.description)"
          />
          <!-- eslint-enable vue/no-v-html -->
          <v-col class="pa-3 text-left" cols="12">
            <v-row class="px-3 py-1 flex-nowrap" align="center">
              <img src="/img/twitter-logo.svg" height="30" class="mr-2" />
              <a
                class="caption text-truncate text-decoration-none"
                :href="`https://twitter.com/${member.twitter.screen_name}`"
                v-text="`twitter.com/${member.twitter.screen_name}`"
              />
            </v-row>
            <v-row class="px-3 py-1 flex-nowrap" align="center">
              <img src="/img/youtube-logo.png" height="16" class="px-1 mr-2" />
              <a
                class="caption text-truncate text-decoration-none"
                :href="
                  `https://www.youtube.com/channel/${member.youtube.channel_id}`
                "
                v-text="`www.youtube.com/channel/${member.youtube.channel_id}`"
              />
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="8" sm="6" cols="12">
        <v-list subheader>
          <v-subheader class="subheading text-uppercase">Schedule</v-subheader>
          <v-divider />
        </v-list>
        <template
          v-if="
            schedules.reduce(
              (carry, schedule) => carry + schedule.events.length,
              0
            )
          "
        >
          <template v-for="(schedule, index) of schedules">
            <event-list
              v-if="schedule.events.length"
              :key="index"
              :date="schedule.date"
              :events="schedule.events"
            />
          </template>
        </template>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="body-1 text-center">
                No Events
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppImage from '~/components/AppImage.vue'
import EventList from '~/components/EventList.vue'

export default {
  components: {
    AppImage,
    EventList
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

    const schedules = await store.dispatch('event/fetchSchedules', {
      startedAt,
      ownerId: member.id
    })
    return { member, schedules }
  }
}
</script>
