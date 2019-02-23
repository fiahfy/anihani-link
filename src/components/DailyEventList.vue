<template>
  <v-list subheader three-line>
    <v-subheader v-text="headline" />
    <template v-for="(event, index) of events">
      <v-divider v-if="index !== 0" :key="index" inset />
      <daily-event-list-tile :key="event.id" :event="event" />
    </template>
  </v-list>
</template>

<script>
import DailyEventListTile from '~/components/DailyEventListTile.vue'

export default {
  components: {
    DailyEventListTile
  },
  props: {
    date: {
      type: Date,
      required: true
    },
    events: {
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
.v-divider--inset {
  margin-left: 98px;
  max-width: calc(100% - 98px);
}
</style>
