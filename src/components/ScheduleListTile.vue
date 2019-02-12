<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      <img
        src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
      />
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title
        v-text="schedule.owner ? schedule.owner.name_ja : schedule.title"
      />
      <v-list-tile-sub-title>
        <span>{{ time }}-</span>
      </v-list-tile-sub-title>
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
    time() {
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
