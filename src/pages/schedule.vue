<template>
  <v-container fill-height pa-0>
    <v-layout column>
      <daily-event-list
        v-for="(dailyEvent, index) of dailyEvents"
        :key="index"
        :date="dailyEvent.date"
        :events="dailyEvent.events"
      />
    </v-layout>
  </v-container>
</template>

<script>
import DailyEventList from '~/components/DailyEventList.vue'

export default {
  components: {
    DailyEventList
  },
  async asyncData({ error, store }) {
    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const dailyEvents = await store.dispatch('event/fetchDailyEvents', {
      startedAt
    })
    if (!dailyEvents.length) {
      return error({ statusCode: 404, message: 'No events' })
    }
    return { dailyEvents }
  }
}
</script>
