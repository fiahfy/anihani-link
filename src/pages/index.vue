<template>
  <v-container fill-height pa-0>
    <v-layout v-if="schedules.length" column>
      <v-card>
        <schedule-list
          v-for="(schedule, index) of schedules"
          :key="index"
          :schedule="schedule"
        />
      </v-card>
    </v-layout>
    <v-layout v-else fill-height align-center justify-center>
      <v-progress-circular v-if="loading" indeterminate color="primary" />
      <div v-else class="text-xs-center">
        <v-icon size="128" color="grey lighten-2">schedule</v-icon>
        <p class="subheading">No Schedules</p>
        <p class="caption">
          No data or No good.
        </p>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleList from '~/components/ScheduleList.vue'

export default {
  components: {
    ScheduleList
  },
  data() {
    return {
      loading: true,
      schedules: []
    }
  },
  async created() {
    const membersSnapshot = await this.$db.collection('members').get()
    const members = membersSnapshot.docs.reduce((carry, doc) => {
      return {
        ...carry,
        [doc.id]: doc.data()
      }
    }, {})

    const d = new Date()
    const yesterday = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const schedulesSnapshot = await this.$db
      .collection('schedules')
      .where('started_at', '>=', yesterday)
      .orderBy('started_at', 'asc')
      .get()
    this.schedules = schedulesSnapshot.docs
      .map((doc) => {
        let owner = doc.data().owner
        if (owner) {
          owner = { ...members[owner.id], id: owner.id }
        }
        return {
          ...doc.data(),
          id: doc.id,
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
    this.loading = false
  }
}
</script>

<style scoped></style>
