<template>
  <v-container class="pa-0">
    <v-list>
      <v-subheader class="text-uppercase">About</v-subheader>
      <div class="body-2 px-6">
        バーチャルYouTuberユニット 「有閑喫茶あにまーれ」「ハニーストラップ」
        のスケジュールを公式Twitter、非公式Wikiから取得し一覧として表示しています<br />
        ゲリラは反映していません<br />
        動作環境: Google Chrome, Mobile Safari
      </div>
    </v-list>

    <v-list>
      <v-subheader class="text-uppercase">Official Twitter</v-subheader>
      <v-list-item
        v-for="group of groups"
        :key="group.id"
        :href="`https://twitter.com/${group.twitter.screen_name}`"
      >
        <v-list-item-action>
          <img src="/img/twitter-logo.svg" height="30" width="30" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="group.name_ja" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list>
      <v-subheader class="text-uppercase">Unofficial Wiki</v-subheader>
      <v-list-item href="https://wikiwiki.jp/animare/">
        <v-list-item-action>
          <v-icon>mdi-wikipedia</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            有閑喫茶あにまーれ
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item href="https://wikiwiki.jp/honeystrap/">
        <v-list-item-action>
          <v-icon>mdi-wikipedia</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>ハニーストラップ</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list>
      <v-subheader class="text-uppercase">Social</v-subheader>
      <v-list-item href="https://github.com/fiahfy/anihani-link">
        <v-list-item-action>
          <img src="/img/github-mark.svg" class="pa-1" height="30" width="30" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>GitHub</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item href="https://twitter.com/fiahfy">
        <v-list-item-action>
          <img src="/img/twitter-logo.svg" height="30" width="30" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Twitter</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
export default {
  asyncData({ store }) {
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
