<template>
  <v-list subheader three-line>
    <v-subheader v-text="headline" />
    <template v-for="(schedule, index) of schedules">
      <v-divider v-if="index !== 0" :key="index" inset class="pl-2" />
      <daily-schedule-list-tile :key="schedule.id" :schedule="schedule" />
    </template>
  </v-list>
</template>

<script>
import DailyScheduleListTile from '~/components/DailyScheduleListTile.vue'

export default {
  components: {
    DailyScheduleListTile
  },
  props: {
    date: {
      type: Date,
      required: true
    },
    schedules: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    headline() {
      const d = new Date(this.date)
      return d.toLocaleDateString(window.navigator.language, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    }
  }
}
</script>

<style scoped>
.v-subheader--inset {
  margin-left: 64px;
}
.v-divider--inset:not(.v-divider--vertical) {
  margin-left: 80px;
  max-width: calc(100% - 80px);
}
</style>
