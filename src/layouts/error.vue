<template>
  <v-container class="fill-height pa-0">
    <v-row class="fill-height" align="center" justify="center">
      <div class="text-center">
        <v-icon size="128" color="grey">mdi-alert-circle-outline</v-icon>
        <p class="subheading mt-2" v-text="message" />
        <p v-if="statusCode === 404" class="caption">
          <nuxt-link to="/">
            Back to the home page
          </nuxt-link>
        </p>
      </div>
    </v-row>
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
