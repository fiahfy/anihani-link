<template>
  <div>
    <v-menu open-on-hover offset-x min-width="256">
      <template v-slot:activator="{ on }">
        <v-card
          class="text-center"
          flat
          tile
          :color="color"
          v-on="on"
          @click="onClick"
        >
          <app-image
            :src="src"
            :lazy-src="lazySrc"
            :max-width="maxWidth"
            :contain="contain"
            height="66"
          />
        </v-card>
      </template>
      <v-card>
        <v-list dense>
          <v-list-item :to="to">
            <v-list-item-avatar color="grey darken-4">
              <app-image :src="src" contain />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="owner" />
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                :class="{ 'grey--text': !event.title }"
                v-text="event.title || 'No title'"
              />
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/event?id=' + event.id">
            <v-list-item-content>
              <v-list-item-title class="text-right">
                Detail
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
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
    to() {
      return this.event.owner ? '/member?id=' + this.event.owner.id : null
    },
    owner() {
      return this.event.owner ? this.event.owner.name_ja : this.event.title
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
          'haneru-inaba': 'rgba(235, 205, 71, 0.3)',
          'ichika-soya': 'rgba(32, 166, 223, 0.3)',
          'izumi-yunohara': 'rgba(119, 74, 58, 0.3)',
          'kuku-kazami': 'rgba(215, 86, 34, 0.3)',
          'mary-saionji': 'rgba(210, 108, 224, 0.3)',
          'mico-sekishiro': 'rgba(197, 208, 144, 0.3)',
          'patra-suo': 'rgba(217, 38, 107, 0.3)',
          'ran-hinokuma': 'rgba(88, 185, 39, 0.3)'
        }[(this.event.owner || {}).id] || 'rgb(66, 66, 66, 0.3)'
      )
    }
  },
  methods: {
    onClick() {
      !('ontouchstart' in window) &&
        this.$router.push('/event?id=' + this.event.id)
    }
  }
}
</script>

<style scoped>
.v-card {
  width: 100%;
}
.v-card >>> .v-responsive.v-image {
  margin: 0 auto;
}
</style>
