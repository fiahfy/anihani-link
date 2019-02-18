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

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default {
  components: {
    MemberCard
  },
  async asyncData({ store }) {
    let members = store.getters['member/members']
    members = shuffle(members)
    return { members }
  }
}
</script>
