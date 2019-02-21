export default async ({ store }) => {
  await store.dispatch('group/fetchGroups')
  await store.dispatch('member/fetchMembers')
}
