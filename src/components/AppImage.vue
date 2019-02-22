<template>
  <v-img v-bind="$attrs" :src="src" :srcset="srcset">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
  </v-img>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    srcset() {
      const index = this.src.lastIndexOf('.')
      const basename = this.src.slice(0, index)
      const ext = this.src.slice(index)
      return `${basename}${ext} 1x, ${basename}@2x${ext} 2x`
    }
  }
}
</script>
