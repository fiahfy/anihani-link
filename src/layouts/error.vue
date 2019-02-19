<template>
  <v-container fill-height pa-0>
    <v-layout fill-height align-center justify-center>
      <div class="text-xs-center">
        <v-icon size="128" color="grey lighten-2">error_outline</v-icon>
        <p class="subheading" v-text="message" />
        <p v-if="statusCode === 404" class="caption">
          <nuxt-link to="/">
            Back to the home page
          </nuxt-link>
        </p>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    return {
      title: this.message
    }
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return (this.error && this.error.message) || 'Error'
    }
  }
}
</script>
