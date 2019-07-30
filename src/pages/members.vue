<template>
  <v-container fill-height pa-0>
    <v-layout column>
      <member-list :members="members" />
    </v-layout>
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
