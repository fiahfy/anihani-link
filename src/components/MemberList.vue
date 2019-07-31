<template>
  <v-list two-line>
    <member-list-item
      v-for="member of members"
      :key="member.id"
      :member="member"
    />
  </v-list>
</template>

<script>
import MemberListItem from '~/components/MemberListItem.vue'

export default {
  components: {
    MemberListItem
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
