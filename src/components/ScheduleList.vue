<template>
  <v-list subheader three-line>
    <v-subheader v-text="headline" />
    <template v-for="(s, index) of schedule.schedules">
      <v-divider v-if="index !== 0" :key="index" inset class="pl-2" />
      <schedule-list-tile :key="s.id" :schedule="s" />
    </template>
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
