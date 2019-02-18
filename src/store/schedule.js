export const state = () => ({
  schedules: {}
})

export const getters = {}

export const actions = {
  async fetchSchedules({ commit }, { startedAt, ownerId }) {
    let query = this.$db
      .collection('schedules')
      .where('started_at', '>=', startedAt)
    if (ownerId) {
      query = query.where(
        'owner',
        '==',
        this.$db.collection('members').doc(ownerId)
      )
    }
    const snapshot = await query.orderBy('started_at', 'asc').get()
    const schedules = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        owner: data.owner ? { id: data.owner.id } : null,
        group: data.group ? { id: data.group.id } : null
      }
    })
    commit('setSchedules', { schedules })
    return schedules
  },
  async fetchSchedule({ commit }, { id }) {
    const doc = await this.$db
      .collection('schedules')
      .doc(id)
      .get()
    if (!doc.exists) {
      return null
    }
    const data = doc.data()
    const schedule = {
      ...data,
      id: doc.id,
      owner: data.owner ? { id: data.owner.id } : null,
      group: data.group ? { id: data.group.id } : null
    }
    commit('setSchedule', { schedule })
    return schedule
  }
}

export const mutations = {
  setSchedules(state, { schedules }) {
    state.schedules = {
      ...schedules.reduce((carry, schedule) => {
        return {
          ...carry,
          [schedule.id]: schedule
        }
      }, {})
    }
  },
  setSchedule(state, { schedule }) {
    state.schedules = {
      ...state.schedules,
      [schedule.id]: { ...schedule }
    }
  }
}
