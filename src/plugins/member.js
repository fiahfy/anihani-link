export default async ({ store }) => {
  await store.dispatch('member/fetchMembers')
}
