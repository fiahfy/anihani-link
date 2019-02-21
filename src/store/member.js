export const state = () => ({
  members: {}
})

export const getters = {
  members: (state) => {
    return Object.values(state.members)
  },
  getMember: (state) => ({ id }) => {
    return state.members[id]
  }
}

export const actions = {
  async fetchMembers({ commit, rootGetters }) {
    const snapshot = await this.$db.collection('members').get()
    const members = snapshot.docs.map((doc) => {
      const data = doc.data()
      const group = data.group
        ? rootGetters['group/getGroup']({ id: data.group.id })
        : null
      return {
        ...data,
        id: doc.id,
        group
      }
    })
    commit('setMembers', { members })
    return members
  }
}

export const mutations = {
  setMembers(state, { members }) {
    state.members = {
      ...members.reduce((carry, member) => {
        return {
          ...carry,
          [member.id]: member
        }
      }, {})
    }
  }
}
