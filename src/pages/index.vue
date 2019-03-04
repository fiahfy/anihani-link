<template>
  <v-container
    fill-height
    pa-0
    :class="{ 'md-and-up': $vuetify.breakpoint.mdAndUp }"
  >
    <v-layout row wrap>
      <v-flex v-for="(schedule, index) of schedules" :key="index" xs12 smw>
        <daily-calendar
          :date="schedule.date"
          :events="schedule.events"
          :class="{ holiday: isHoliday(schedule.date) }"
        />
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
    window.scrollTo(0, top)
  },
  methods: {
    isHoliday(date) {
      return [0, 6].includes(date.getDay())
    }
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
.md-and-up .flex.smw >>> .wrapper > div {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.md-and-up .flex.smw >>> .wrapper.holiday .hour:not(.current) {
  background-color: #424242;
}
.md-and-up .flex.smw:first-child >>> .hour > .label {
  margin-left: -40px;
}
.md-and-up .flex.smw:first-child >>> .hour.current {
  width: 700%;
  z-index: 1;
}
.md-and-up .flex.smw:not(:first-child) >>> .hour > .label {
  display: none;
}
.md-and-up .flex.smw:not(:first-child) >>> .hour.current {
  display: none;
}
.md-and-up .flex.smw >>> .content {
  padding-left: 0;
}
.md-and-up .flex.smw >>> .content .v-image {
  z-index: 2;
}
</style>
