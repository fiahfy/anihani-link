<template>
  <v-container fill-height pa-0>
    <v-layout column>
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
  watchQuery: ['owner_id'],
  async asyncData({ query, store }) {
    const { owner_id: ownerId } = query

    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const schedules = await store.dispatch('schedule/fetchSchedules', {
      startedAt,
      ownerId
    })
    return { schedules }
  }
}
</script>
