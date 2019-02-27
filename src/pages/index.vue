<template>
  <v-container
    fill-height
    pa-0
    :class="{ 'md-and-up': $vuetify.breakpoint.mdAndUp }"
  >
    <v-layout row wrap>
      <v-flex v-for="(schedule, index) of schedules" :key="index" xs12 smw>
        <daily-calendar :date="schedule.date" :events="schedule.events" />
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

    const schedules = await store.dispatch('event/fetchSchedules', {
      startedAt
    })
    return { schedules }
  },
  mounted() {
    const d = new Date()
    const top =
      66 * (d.getHours() + 2 + d.getMinutes() / 60) - window.innerHeight / 2
    setTimeout(() => {
      window.scrollTo(0, top)
    }, 0)
  }
}
</script>

<style scoped>
.md-and-up > .layout {
  padding-left: 56px;
  padding-right: 16px;
}
.md-and-up .flex.smw {
  flex-basis: calc(100% / 7);
  max-width: calc(100% / 7);
}
.md-and-up .flex.smw >>> .v-subheader {
  justify-content: center;
}
.md-and-up .flex.smw >>> .layout.wrapper > div {
  margin-left: 2px !important;
  margin-right: 2px !important;
}
.md-and-up
  .flex.smw:not(:first-child)
  >>> .layout.wrapper
  > div
  > .layout
  > div {
  display: none;
}
.md-and-up .flex.smw:first-child >>> .layout.wrapper > div > .layout > div {
  margin-left: -40px;
}
.md-and-up .flex.smw >>> .layout.wrapper > div > .content {
  padding-left: 0;
}
</style>
