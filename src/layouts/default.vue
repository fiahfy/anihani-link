<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-tile v-for="(tab, index) in tabs" :key="index" :to="tab.path">
          <v-list-tile-action>
            <v-icon>{{ tab.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="tab.title" />
          </v-list-tile-content>
        </v-list-tile>
        <v-divider />
        <v-subheader class="text-uppercase">Schedules</v-subheader>
        <v-list-tile
          v-for="member in members"
          :key="member.id"
          :to="'/?owner_id=' + member.id"
          :class="getTileClass(member)"
          avatar
          active-class=""
        >
          <v-list-tile-avatar color="grey darken-4">
            <v-img :src="`/img/members/${member.id}_96x96.png`" contain />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="member.name_ja" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app clipped-left>
      <v-toolbar-side-icon
        class="hidden-xs-only"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title class="d-flex align-center">
        <img src="/icon_transparent.png" height="44" class="mb-1" />
        <span>{{ title }}</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content class="fill-height scroll-y">
      <nuxt />
    </v-content>

    <v-footer app mandatory height="56" class="hidden-sm-and-up">
      <v-bottom-nav :active.sync="activeIndex" :value="true">
        <v-btn
          v-for="(tab, index) of tabs"
          :key="index"
          color="primary"
          flat
          :value="index"
          @click="(e) => onTabClick(e, tab)"
        >
          <span>{{ tab.title }}</span>
          <v-icon>{{ tab.icon }}</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  data() {
    return {
      drawer: null,
      activeIndex: 0,
      tabs: [
        {
          title: 'Schedule',
          icon: 'schedule',
          names: ['index', 'schedules'],
          path: '/'
        },
        {
          title: 'Member',
          icon: 'account_circle',
          names: ['members'],
          path: '/members'
        },
        {
          title: 'About',
          icon: 'help',
          names: ['about'],
          path: '/about'
        }
      ]
    }
  },
  computed: {
    title() {
      return document.title
    },
    today() {
      return new Date(this.now).getDate()
    },
    ...mapState('member', ['members'])
  },
  created() {
    this.activeIndex = this.tabs.findIndex((tab) =>
      tab.names.includes(this.$route.name)
    )
  },
  methods: {
    onTabClick(e, tab) {
      this.$router.push(tab.path)
    },
    getTileClass(member) {
      const { owner_id: ownerId } = this.$route.query
      return { 'primary--text': member.id === ownerId }
    }
  }
}
</script>

<style scoped>
@media only screen and (max-width: 599px) {
  .v-toolbar__title:not(:first-child) {
    margin-left: 0 !important;
  }
}
@media only screen and (min-width: 600px) {
  .v-content {
    padding-bottom: 0 !important;
  }
}
@media only screen and (min-width: 1264px) {
  .v-navigation-drawer {
    max-height: calc(100% - 64px) !important;
  }
}
.v-item-group.v-bottom-nav .v-btn--active {
  padding-top: 8px;
}
.v-item-group.v-bottom-nav .v-btn--active >>> .v-btn__content {
  font-size: 12px;
}
</style>
