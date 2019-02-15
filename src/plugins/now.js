export default ({ store }) => {
  const { commit } = store
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      commit('adjustTime')
    }
  })
}
