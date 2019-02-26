<template>
  <v-layout column>
    <v-layout v-for="hour of hours" :key="hour">
      <div>{{ hour }}</div>
      <v-divider />
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      hours: [...Array(24).keys()]
    }
  }
}
</script>
