<template>
  <v-container fill-height pa-0>
    <v-layout v-if="schedules.length" column>
      <schedule-all :schedules="schedules" />
    </v-layout>
    <v-layout v-else fill-height align-center justify-center>
      <div class="text-xs-center">
        <v-icon size="128" color="grey">schedule</v-icon>
        <p class="subheading">No Schedules</p>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleAll from '~/components/ScheduleAll.vue'

export default {
  components: {
    ScheduleAll
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
