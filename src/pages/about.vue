<template>
  <v-container fill-height pa-0>
    <v-layout column>
      <v-card>
        <v-list v-if="groups.length">
          <v-list-tile
            v-for="group of groups"
            :key="group.id"
            :href="`https://twitter.com/${group.twitter.screen_name}`"
          >
            <v-list-tile-action>
              <img src="/img/twitter-logo.svg" height="30" width="30" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="group.name_ja" />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-layout v-else-if="loading" ma-3 align-center justify-center>
          <v-progress-circular indeterminate color="primary" />
        </v-layout>

        <v-list>
          <v-subheader>Social</v-subheader>
          <v-list-tile href="https://github.com/fiahfy/anihani-link">
            <v-list-tile-action>
              <img
                src="/img/github-mark.svg"
                class="pa-1"
                height="30"
                width="30"
              />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>GitHub</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="https://twitter.com/fiahfy">
            <v-list-tile-action>
              <img src="/img/twitter-logo.svg" height="30" width="30" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Twitter</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      groups: []
    }
  },
  async created() {
    const snapshot = await this.$db.collection('groups').get()
    this.groups = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    this.loading = false
  }
}
</script>
