<template>
  <v-card>
    <schedule-list
      v-for="(daySchedule, index) of daySchedules"
      :key="index"
      :date="daySchedule.date"
      :schedules="daySchedule.schedules"
    />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ScheduleList from '~/components/ScheduleList.vue'

export default {
  components: {
    ScheduleList
  },
  props: {
    schedules: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    daySchedules() {
      return this.schedules
        .map((schedule) => {
          let owner = schedule.owner
          if (owner) {
            owner = this.getMember({ id: owner.id })
          }
          return {
            ...schedule,
            owner
          }
        })
        .reduce((carry, schedule) => {
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
    },
    ...mapGetters('member', ['getMember'])
  }
}
</script>
