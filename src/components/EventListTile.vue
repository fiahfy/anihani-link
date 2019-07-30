<template>
  <v-list-item :to="'/event?id=' + event.id">
    <v-divider vertical :color="color" class="mr-3" />
    <v-list-item-avatar size="48" color="grey darken-4 mr-3">
      <app-image :src="src" contain />
    </v-list-item-avatar>

    <v-list-item-content class="align-start">
      <v-list-item-title :class="{ 'font-weight-bold': highlighted }">
        <v-row class="px-3" align="center" justify="space-between">
          <span>{{ startedAt }} -</span>
          <span v-if="live" class="live primary--text caption text-uppercase">
            Live Now
          </span>
          <span
            v-else
            class="caption text-right"
            :class="{ 'font-weight-bold': highlighted }"
          >
            {{ event.started_at.toDate() | time_ago }}
          </span>
        </v-row>
      </v-list-item-title>
      <v-list-item-subtitle>
        <span
          :class="{ 'text--primary': true, 'font-weight-bold': highlighted }"
          v-text="owner"
        />
        {{ title }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
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
  data() {
    return {
      timer: null,
      now: new Date()
    }
  },
  computed: {
    color() {
      return {
        'charlotte-shimamura': '#676ee4',
        'eli-sogetsu': '#94a2b8',
        'haneru-inaba': '#ebcd47',
        'hinako-umori': '#f075a8',
        'ichika-soya': '#20a6df',
        'mary-saionji': '#d26ce0',
        'mico-sekishiro': '#c5d090',
        'patra-suo': '#d9266b',
        'ran-hinokuma': '#58b927'
      }[(this.event.owner || {}).id]
    },
    live() {
      const endedAt = this.event.started_at.toDate()
      endedAt.setHours(endedAt.getHours() + 1)
      return this.event.started_at.toDate() < this.now && endedAt > this.now
    },
    highlighted() {
      const endedAt = this.event.started_at.toDate()
      endedAt.setHours(endedAt.getHours() + 1)
      return endedAt > this.now
    },
    src() {
      return this.event.owner
        ? `/img/members/${this.event.owner.id}_48x48.png`
        : `/img/groups/${this.event.group.id}_113x48.png`
    },
    owner() {
      return this.event.owner ? this.event.owner.name_ja : this.event.title
    },
    title() {
      return this.event.title ? ' — ' + this.event.title : ''
    },
    startedAt() {
      const d = this.event.started_at.toDate()
      return d.toLocaleTimeString(window.navigator.language, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.now = new Date()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.v-divider {
  border-right-width: 2px;
}
.v-list-item__content {
  padding-top: 10px;
}
.v-list-item__subtitle {
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}
.live {
  border: 1px solid var(--v-primary-base);
  padding: 1px 4px;
  line-height: 14px;
  box-sizing: content-box;
}
</style>
