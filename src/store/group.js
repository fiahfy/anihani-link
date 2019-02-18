export const state = () => ({
  groups: {}
})

export const getters = {}

export const actions = {
  async fetchGroups({ commit }) {
    const snapshot = await this.$db.collection('groups').get()
    const groups = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id
      }
    })
    commit('setGroups', { groups })
    return groups
  }
}

export const mutations = {
  setGroups(state, { groups }) {
    state.groups = {
      ...groups.reduce((carry, group) => {
        return {
          ...carry,
          [group.id]: group
        }
      }, {})
    }
  }
}
