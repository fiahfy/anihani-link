export const state = () => ({
  schedules: []
})

export const getters = {}

export const actions = {
  async fetchSchedules(_, { startedAt }) {
    const snapshot = await this.$db
      .collection('schedules')
      .where('started_at', '>=', startedAt)
      .orderBy('started_at', 'asc')
      .get()
    const schedules = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        owner: data.owner ? { id: data.owner.id } : null,
        group: data.group ? { id: data.group.id } : null
      }
    })
    return schedules
  },
  async fetchSchedule(_, { id }) {
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
    return schedule
  }
}

export const mutations = {
  setSchedules(state, { schedules }) {
    state.schedules = schedules
  }
}
