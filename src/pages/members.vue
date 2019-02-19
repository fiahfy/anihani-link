<template>
  <v-container fill-height>
    <v-layout v-if="members.length" column>
      <member-card
        v-for="member of members"
        :key="member.id"
        :member="member"
      />
    </v-layout>
    <v-layout v-else fill-height align-center justify-center>
      <div class="text-xs-center">
        <v-icon size="128" color="grey">account_circle</v-icon>
        <p class="subheading">No Members</p>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import MemberCard from '~/components/MemberCard.vue'

export default {
  components: {
    MemberCard
  },
  async asyncData({ store }) {
    const members = store.getters['member/members']
    return { members }
  }
}
</script>
