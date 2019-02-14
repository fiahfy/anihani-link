<template>
  <v-card class="ma-3" :style="{ 'background-color': color }" dark>
    <v-card-actions class="pt-3 pb-0">
      <v-list-tile class="grow">
        <v-list-tile-avatar color="grey darken-4" size="48" class="mr-1">
          <v-img :src="src" contain />
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title v-text="member.name_ja" />
        </v-list-tile-content>

        <v-layout align-center justify-end>
          <v-btn
            icon
            :href="
              `https://www.youtube.com/channel/${member.youtube.channel_id}`
            "
          >
            <img src="/img/youtube-logo.png" height="16" />
          </v-btn>
          <v-btn
            icon
            :href="`https://twitter.com/${member.twitter.screen_name}`"
          >
            <img src="/img/twitter-logo.svg" height="30" />
          </v-btn>
        </v-layout>
      </v-list-tile>
    </v-card-actions>
    <v-card-text v-html="description" />
  </v-card>
</template>

<script>
const colors = {
  'ran-hinokuma': 'rgb(123, 187, 80)',
  'hinako-umori': 'rgb(233, 127, 172)',
  'haneru-inaba': 'rgb(235, 211, 109)',
  'ichika-soya': 'rgb(85, 188, 232)',
  'mico-sekishiro': 'rgb(181, 207, 129)',
  'eli-sogetsu': 'rgb(174, 181, 192)',
  'patra-suo': 'rgb(250, 52, 127)',
  'charlotte-shimamura': 'rgb(126, 133, 251)',
  'mary-saionji': 'rgb(206, 132, 216)'
}

export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  computed: {
    color() {
      return colors[this.member.id]
    },
    src() {
      return `/img/members/${this.member.id}_96x96.png`
    },
    description() {
      return this.member.description.replace(/\n/g, '<br />')
    }
  }
}
</script>
