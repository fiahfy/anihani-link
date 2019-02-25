<template>
  <v-container fill-height pa-0>
    <v-layout column>
      <v-card>
        <v-list>
          <v-subheader class="text-uppercase">About</v-subheader>
          <div class="body-2 px-4">
            バーチャルYouTuberユニット
            「有閑喫茶あにまーれ」「ハニーストラップ」
            のスケジュールを公式Twitter、非公式Wikiから取得し一覧として表示しています<br />
            ゲリラは反映していません<br />
            動作環境: Google Chrome, Mobile Safari
          </div>
        </v-list>

        <v-list>
          <v-subheader class="text-uppercase">Official Twitter</v-subheader>
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

        <v-list>
          <v-subheader class="text-uppercase">Unofficial Wiki</v-subheader>
          <v-list-tile href="https://wikiwiki.jp/animare/">
            <v-list-tile-action>
              <v-icon>language</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                有閑喫茶あにまーれ
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="https://wikiwiki.jp/honeystrap/">
            <v-list-tile-action>
              <v-icon>language</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>ハニーストラップ</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list>
          <v-subheader class="text-uppercase">Social</v-subheader>
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
  async asyncData({ store }) {
    const groups = store.getters['group/groups']
    return { groups }
  }
}
</script>

<style scoped>
.v-list {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-left);
}
</style>
