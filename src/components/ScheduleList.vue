<template>
  <v-list subheader two-line>
    <v-subheader inset v-text="headline" />
    <v-divider inset class="pl-2" />
    <schedule-list-tile
      v-for="s of schedule.schedules"
      :key="s.id"
      :schedule="s"
    />
  </v-list>
</template>

<script>
import ScheduleListTile from '~/components/ScheduleListTile.vue'

export default {
  components: {
    ScheduleListTile
  },
  props: {
    schedule: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    headline() {
      const d = new Date(this.schedule.date)
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
