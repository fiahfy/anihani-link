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
  async fetchMembers({ commit }) {
    const snapshot = await this.$db.collection('members').get()
    const members = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        group: data.group ? { id: data.group.id } : null
      }
    })
    commit('setMembers', { members })
    return members
  },
  async fetchMember({ commit }, { id }) {
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
    commit('setMember', { member })
    return member
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
  },
  setMember(state, { member }) {
    state.members = {
      ...state.members,
      [member.id]: { ...member }
    }
  }
}
