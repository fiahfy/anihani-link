<template>
  <v-list two-line>
    <member-list-tile
      v-for="member of members"
      :key="member.id"
      :member="member"
    />
  </v-list>
</template>

<script>
import MemberListTile from '~/components/MemberListTile.vue'

export default {
  components: {
    MemberListTile
  },
  props: {
    members: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.v-list {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-left);
}
</style>
