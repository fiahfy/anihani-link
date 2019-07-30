<template>
  <v-container
    class="fill-height pa-0"
    :class="{ 'md-and-up': $vuetify.breakpoint.mdAndUp }"
  >
    <v-row>
      <v-col
        v-for="(schedule, index) of schedules"
        :key="index"
        class="smw"
        cols="12"
      >
        <daily-calendar
          :date="schedule.date"
          :events="schedule.events"
          :class="{ today: index === 0 }"
        />
      </v-col>
    </v-row>
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
.md-and-up .flex.smw >>> .wrapper.today .hour:not(.current) {
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
