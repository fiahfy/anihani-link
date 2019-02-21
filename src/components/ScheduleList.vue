<template>
  <div style="width: 100%;">
    <daily-schedule-list
      v-for="(daySchedule, index) of daySchedules"
      :key="index"
      :date="daySchedule.date"
      :schedules="daySchedule.schedules"
    />
  </div>
</template>

<script>
import DailyScheduleList from '~/components/DailyScheduleList.vue'

export default {
  components: {
    DailyScheduleList
  },
  props: {
    schedules: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    daySchedules() {
      return this.schedules.reduce((carry, schedule) => {
        const d = schedule.started_at.toDate()
        const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        if (
          carry.length &&
          carry[carry.length - 1].date.getTime() === date.getTime()
        ) {
          carry[carry.length - 1].schedules = [
            ...carry[carry.length - 1].schedules,
            schedule
          ]
          return carry
        }
        return [
          ...carry,
          {
            date,
            schedules: [schedule]
          }
        ]
      }, [])
    }
  }
}
</script>
