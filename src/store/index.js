export const state = () => ({
  now: Date.now()
})

export const getters = {}

export const actions = {}

export const mutations = {
  adjustTime(state) {
    state.now = Date.now()
  }
}
