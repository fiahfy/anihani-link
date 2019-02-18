export const state = () => ({
  members: []
})

export const getters = {}

export const actions = {
  async fetchMembers() {
    const snapshot = await this.$db.collection('members').get()
    const members = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        group: data.group ? { id: data.group.id } : null
      }
    })
    return members
  },
  async fetchMember(_, { id }) {
    const doc = await this.$db
      .collection('members')
      .doc(id)
      .get()
    if (!doc.exists) {
      return null
    }
    const data = doc.data()
    const member = {
      ...data,
      id: doc.id,
      group: data.group ? { id: data.group.id } : null
    }
    return member
  }
}

export const mutations = {
  setMembers(state, { members }) {
    state.members = members
  }
}
