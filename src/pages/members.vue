<template>
  <v-container class="pa-0">
    <member-list :members="members" />
  </v-container>
</template>

<script>
import MemberList from '~/components/MemberList.vue'

export default {
  components: {
    MemberList
  },
  asyncData({ error, store }) {
    const members = store.getters['member/members']
    if (!members.length) {
      return error({ statusCode: 404, message: 'No members' })
    }
    return { members }
  }
}
</script>
