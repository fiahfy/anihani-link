<template>
  <v-card
    class="text-xs-center"
    flat
    tile
    :color="color"
    :to="'/event?id=' + event.id"
  >
    <app-image
      :src="src"
      :lazy-src="lazySrc"
      height="66"
      :max-width="maxWidth"
      :contain="contain"
    />
  </v-card>
</template>

<script>
import AppImage from '~/components/AppImage.vue'

export default {
  components: {
    AppImage
  },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    src() {
      return this.event.owner
        ? `/img/members/${this.event.owner.id}_96x96.png`
        : `/img/groups/${this.event.group.id}_226x96.png`
    },
    lazySrc() {
      return this.event.owner
        ? `/img/members/${this.event.owner.id}_48x48.png`
        : `/img/groups/${this.event.group.id}_113x48.png`
    },
    maxWidth() {
      return this.event.owner ? 66 : 155
    },
    contain() {
      return !this.event.owner
    },
    color() {
      return (
        {
          'charlotte-shimamura': 'rgba(103, 110, 228, 0.3)',
          'eli-sogetsu': 'rgba(148, 162, 184, 0.3)',
          'haneru-inaba': 'rgba(235, 205, 71, 0.3)',
          'hinako-umori': 'rgba(240, 117, 168, 0.3)',
          'ichika-soya': 'rgba(32, 166, 223, 0.3)',
          'mary-saionji': 'rgba(210, 108, 224, 0.3)',
          'mico-sekishiro': 'rgba(197, 208, 144, 0.3)',
          'patra-suo': 'rgba(217, 38, 107, 0.3)',
          'ran-hinokuma': 'rgba(88, 185, 39, 0.3)'
        }[(this.event.owner || {}).id] || 'rgb(66, 66, 66, 0.3)'
      )
    }
  }
}
</script>

<style scoped>
.v-card >>> .v-responsive.v-image {
  margin: 0 auto;
}
</style>
