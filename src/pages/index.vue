<template>
  <v-container fill-height pa-0>
    <v-layout v-if="schedules.length">
      <schedule-list :schedules="schedules" />
    </v-layout>
    <v-layout v-else align-center justify-center column>
      <v-icon size="128" color="grey">schedule</v-icon>
      <p class="subheading">No Schedules</p>
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleList from '~/components/ScheduleList.vue'

export default {
  components: {
    ScheduleList
  },
  async asyncData({ store }) {
    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const schedules = await store.dispatch('schedule/fetchSchedules', {
      startedAt
    })
    return { schedules }
  }
}
</script>
