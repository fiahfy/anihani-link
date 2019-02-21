<template>
  <v-container fill-height>
    <v-layout column>
      <member-card
        v-for="member of members"
        :key="member.id"
        :member="member"
      />
    </v-layout>
  </v-container>
</template>

<script>
import MemberCard from '~/components/MemberCard.vue'

export default {
  components: {
    MemberCard
  },
  async asyncData({ error, store }) {
    const members = store.getters['member/members']
    if (!members.length) {
      return error({ statusCode: 404, message: 'No Members' })
    }
    return { members }
  }
}
</script>
