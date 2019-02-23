<template>
  <div style="width: 100%;">
    <daily-event-list
      v-for="(dayEvent, index) of dayEvents"
      :key="index"
      :date="dayEvent.date"
      :events="dayEvent.events"
    />
  </div>
</template>

<script>
import DailyEventList from '~/components/DailyEventList.vue'

export default {
  components: {
    DailyEventList
  },
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dayEvents() {
      return this.events.reduce((carry, event) => {
        const d = event.started_at.toDate()
        const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        if (
          carry.length &&
          carry[carry.length - 1].date.getTime() === date.getTime()
        ) {
          carry[carry.length - 1].events = [
            ...carry[carry.length - 1].events,
            event
          ]
          return carry
        }
        return [
          ...carry,
          {
            date,
            events: [event]
          }
        ]
      }, [])
    }
  }
}
</script>
