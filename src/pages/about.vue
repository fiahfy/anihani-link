<template>
  <v-container fill-height>
    <v-layout column>
      <v-card>
        <v-list>
          <v-list-tile href="https://github.com/fiahfy/paddy">
            <v-list-tile-action>
              <img
                src="~/assets/github-mark.svg"
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
              <img src="~/assets/twitter-logo.svg" height="30" width="30" />
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
