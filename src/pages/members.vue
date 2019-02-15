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
      <v-progress-circular v-if="loading" indeterminate color="primary" />
      <div v-else class="text-xs-center">
        <v-icon size="128" color="grey lighten-2">account_circle</v-icon>
        <p class="subheading">No Members</p>
        <p class="caption">
          No data or No good.
        </p>
      </div>
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
  data() {
    return {
      loading: true,
      members: []
    }
  },
  async created() {
    const snapshot = await this.$db.collection('members').get()
    const members = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    this.members = shuffle(members)
    this.loading = false
  }
}
</script>
