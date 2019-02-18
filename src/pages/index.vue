<template>
  <v-container fill-height pa-0>
    <v-layout column>
      <v-card>
        <schedule-list
          v-for="(schedule, index) of schedules"
          :key="index"
          :schedule="schedule"
        />
      </v-card>
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
    let members = await store.dispatch('member/fetchMembers')
    members = members.reduce((carry, member) => {
      return {
        ...carry,
        [member.id]: member
      }
    }, {})

    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    let schedules = await store.dispatch('schedule/fetchSchedules', {
      startedAt
    })
    schedules = schedules
      .map((schedule) => {
        let owner = schedule.owner
        if (owner) {
          owner = { ...members[owner.id], id: owner.id }
        }
        return {
          ...schedule,
          owner
        }
      })
      .reduce((carry, schedule) => {
        const d = schedule.started_at.toDate()
        const date = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate()
        ).getTime()
        if (carry.length && carry[carry.length - 1].date === date) {
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
    return { schedules }
  }
}
</script>
