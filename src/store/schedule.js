export const state = () => ({
  schedules: {}
})

export const getters = {}

export const actions = {
  async fetchSchedules({ commit, rootGetters }, { startedAt, ownerId }) {
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
    commit('setSchedules', { schedules })
    return schedules
  },
  async fetchSchedule({ commit, rootGetters }, { id }) {
    const doc = await this.$db
      .collection('schedules')
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
    const schedule = {
      ...data,
      id: doc.id,
      owner,
      group
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
