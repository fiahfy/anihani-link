<template>
  <v-container fill-height>
    <v-layout v-if="members.length" column>
      <v-card
        v-for="member of members"
        :key="member.id"
        class="ma-3"
        :style="{ 'background-color': colors[member.id] }"
        dark
      >
        <v-card-actions>
          <v-list-tile class="grow">
            <v-list-tile-avatar color="grey darken-4" size="48" class="mr-1">
              <v-img :src="getSrc(member)" />
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
        <v-card-text v-text="member.description" />
      </v-card>
    </v-layout>
    <v-layout v-else fill-height align-center justify-center>
      <v-progress-circular v-if="loading" indeterminate color="primary" />
      <div v-else class="text-xs-center">
        <v-icon size="128" color="grey lighten-2">account_circle</v-icon>
        <p class="subheading">No Members</p>
        <p class="caption">
          No data or No good.
        </p>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
const colors = {
  'ran-hinokuma': 'rgb(123, 187, 80)',
  'hinako-umori': 'rgb(233, 127, 172)',
  'haneru-inaba': 'rgb(235, 211, 109)',
  'ichika-soya': 'rgb(85, 188, 232)',
  'mico-sekishiro': 'rgb(181, 207, 129)',
  'eli-sogetsu': 'rgb(172, 172, 172)',
  'patra-suo': 'rgb(250, 52, 127)',
  'charlotte-shimamura': 'rgb(126, 133, 251)',
  'mary-saionji': 'rgb(206, 132, 216)'
}

export default {
  data() {
    return {
      colors,
      loading: true,
      members: []
    }
  },
  async created() {
    const snapshot = await this.$db.collection('members').get()
    this.members = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    this.loading = false
  },
  methods: {
    getSrc(member) {
      return `/img/members/${member.id}_96x96.png`
    }
  }
}
</script>
