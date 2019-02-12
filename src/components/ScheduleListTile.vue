<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      <img
        src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
      />
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-sub-title>{{ startedAt }} - </v-list-tile-sub-title>
      <v-list-tile-title>
        <span v-text="title" />
        <span class="caption ml-1" v-text="schedule.description" />
      </v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
export default {
  props: {
    schedule: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    title() {
      return this.schedule.owner
        ? this.schedule.owner.name_ja
        : this.schedule.title
    },
    startedAt() {
      const d = this.schedule.started_at.toDate()
      return d.toLocaleTimeString(window.navigator.language, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
    }
  }
}
</script>
