<template>
  <v-container fill-height pa-0>
    <v-layout column>
      <template v-for="(schedule, index) of schedules">
        <event-list
          v-if="schedule.events.length"
          :key="index"
          :date="schedule.date"
          :events="schedule.events"
        />
      </template>
    </v-layout>
  </v-container>
</template>

<script>
import EventList from '~/components/EventList.vue'

export default {
  components: {
    EventList
  },
  async asyncData({ error, store }) {
    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const schedules = await store.dispatch('event/fetchSchedules', {
      startedAt
    })
    if (
      !schedules.reduce((carry, schedule) => carry + schedule.events.length, 0)
    ) {
      return error({ statusCode: 404, message: 'No events' })
    }
    return { schedules }
  }
}
</script>
