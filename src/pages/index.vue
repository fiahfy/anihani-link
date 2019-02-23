<template>
  <v-container fill-height pa-0>
    <v-layout>
      <event-list :events="events" />
    </v-layout>
  </v-container>
</template>

<script>
import EventList from '~/components/EventList.vue'

export default {
  components: {
    EventList
  },
  async asyncData({ error, store }) {
    const d = new Date()
    const startedAt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const events = await store.dispatch('event/fetchEvents', {
      startedAt
    })
    if (!events.length) {
      return error({ statusCode: 404, message: 'No events' })
    }
    return { events }
  }
}
</script>
