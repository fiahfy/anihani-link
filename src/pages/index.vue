<template>
  <v-container fill-height pa-0>
    <v-layout row wrap>
      <v-flex v-for="(dailyEvent, index) of dailyEvents" :key="index" xs12 smw>
        <daily-calendar :date="dailyEvent.date" :events="dailyEvent.events" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DailyCalendar from '~/components/DailyCalendar.vue'

export default {
  components: {
    DailyCalendar
  },
  async asyncData({ store }) {
    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const dailyEvents = await store.dispatch('event/fetchDailyEvents', {
      startedAt
    })
    return { dailyEvents }
  },
  mounted() {
    const d = new Date()
    const top =
      66 * (d.getHours() + 2 + d.getMinutes() / 60) - window.innerHeight / 2
    window.scrollTo(0, top)
  }
}
</script>

<style scoped>
@media (min-width: 960px) {
  .flex.smw {
    flex-basis: calc(100% / 7);
    max-width: calc(100% / 7);
  }
}
</style>
