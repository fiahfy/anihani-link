<template>
  <v-container fill-height pa-0>
    <v-layout>
      <schedule-list :schedules="schedules" />
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleList from '~/components/ScheduleList.vue'

export default {
  components: {
    ScheduleList
  },
  async asyncData({ error, store }) {
    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const schedules = await store.dispatch('schedule/fetchSchedules', {
      startedAt
    })
    if (!schedules.length) {
      return error({ statusCode: 404, message: 'No schedules' })
    }
    return { schedules }
  }
}
</script>
