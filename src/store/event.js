export const state = () => ({
  events: {}
})

export const getters = {}

export const actions = {
  async fetchSchedules({ dispatch }, { startedAt, ownerId }) {
    const events = await dispatch('fetchEvents', { startedAt, ownerId })
    const dailyEvents = events.reduce((carry, event) => {
      const d = event.started_at.toDate()
      const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      if (carry[date]) {
        carry[date] = [...carry[date], event]
        return carry
      }
      return {
        ...carry,
        [date]: [event]
      }
    }, {})

    let schedules = []
    const startDate = new Date(
      startedAt.getFullYear(),
      startedAt.getMonth(),
      startedAt.getDate()
    )
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      schedules = [
        ...schedules,
        {
          date: d,
          events: dailyEvents[d] || []
        }
      ]
    }
    return schedules
  },
  async fetchEvents({ commit, rootGetters }, { startedAt, ownerId }) {
    let query = this.$db
      .collection('events')
      .where('started_at', '>=', startedAt)
    if (ownerId) {
      query = query.where(
        'owner',
        '==',
        this.$db.collection('members').doc(ownerId)
      )
    }
    const snapshot = await query.orderBy('started_at', 'asc').get()
    const events = snapshot.docs.map((doc) => {
      const data = doc.data()
      const owner = data.owner
        ? rootGetters['member/getMember']({ id: data.owner.id })
        : null
      const group = data.group
        ? rootGetters['group/getGroup']({ id: data.group.id })
        : null
      return {
        ...data,
        id: doc.id,
        owner,
        group
      }
    })
    commit('setEvents', { events })
    return events
  },
  async fetchEvent({ commit, rootGetters }, { id }) {
    const doc = await this.$db
      .collection('events')
      .doc(id)
      .get()
    if (!doc.exists) {
      return null
    }
    const data = doc.data()
    const owner = data.owner
      ? rootGetters['member/getMember']({ id: data.owner.id })
      : null
    const group = data.group
      ? rootGetters['group/getGroup']({ id: data.group.id })
      : null
    const event = {
      ...data,
      id: doc.id,
      owner,
      group
    }
    commit('setEvent', { event })
    return event
  }
}

export const mutations = {
  setEvents(state, { events }) {
    state.events = {
      ...events.reduce((carry, event) => {
        return {
          ...carry,
          [event.id]: event
        }
      }, {})
    }
  },
  setEvent(state, { event }) {
    state.events = {
      ...state.events,
      [event.id]: { ...event }
    }
  }
}
