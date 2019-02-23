<template>
  <v-list-tile avatar :to="'/event?id=' + event.id">
    <v-divider vertical :color="color" class="mr-3" />
    <v-list-tile-avatar size="48" color="grey darken-4">
      <app-image :src="src" contain />
    </v-list-tile-avatar>

    <v-list-tile-content class="justify-start">
      <v-list-tile-title :class="{ 'font-weight-bold': highlighted }">
        <v-layout align-center>
          <span>{{ startedAt }} -</span>
          <span
            v-if="live"
            class="live primary--text caption ml-2 text-uppercase"
          >
            Live Now
          </span>
        </v-layout>
      </v-list-tile-title>
      <v-list-tile-sub-title>
        <span
          :class="{ 'text--primary': true, 'font-weight-bold': highlighted }"
          v-text="title"
        />
        {{ description }}
      </v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
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
      date: new Date()
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
      return (
        this.event.started_at.toDate() < this.date && endedAt > this.date
      )
    },
    highlighted() {
      const endedAt = this.event.started_at.toDate()
      endedAt.setHours(endedAt.getHours() + 1)
      return endedAt > this.date
    },
    src() {
      return this.event.owner
        ? `/img/members/${this.event.owner.id}_48x48.png`
        : `/img/groups/${this.event.group.id}_113x48.png`
    },
    title() {
      return this.event.owner
        ? this.event.owner.name_ja
        : this.event.title
    },
    description() {
      return this.event.description ? ' — ' + this.event.description : ''
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
      this.date = new Date()
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
.v-list__tile__avatar {
  min-width: 64px;
  margin-top: -12px;
}
.v-list__tile__content {
  padding-top: 10px;
}
.v-list__tile__sub-title {
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
