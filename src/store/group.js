export const state = () => ({
  groups: []
})

export const getters = {}

export const actions = {
  async fetchGroups() {
    const snapshot = await this.$db.collection('groups').get()
    const groups = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id
      }
    })
    return groups
  }
}

export const mutations = {
  setGroups(state, { groups }) {
    state.groups = groups
  }
}
