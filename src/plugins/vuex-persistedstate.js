import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    paths: ['version', 'categoryId', 'timestamp', 'active']
  })(store)
}
