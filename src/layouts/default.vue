<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-tile v-for="(nav, index) in navs" :key="index" :to="nav.path">
          <v-list-tile-action>
            <v-icon>{{ nav.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="nav.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider />
      <v-list subheader>
        <v-subheader class="text-uppercase">Members</v-subheader>
        <v-list-tile
          v-for="member in members"
          :key="member.id"
          :to="'/member?id=' + member.id"
          :class="getTileClass(member)"
          avatar
          active-class=""
        >
          <v-list-tile-avatar color="grey darken-4">
            <app-image :src="`/img/members/${member.id}_48x48.png`" />
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
          v-for="(nav, index) of navs"
          :key="index"
          color="primary"
          flat
          @click="(e) => onTabClick(e, nav)"
        >
          <span>{{ nav.title }}</span>
          <v-icon>{{ nav.icon }}</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import AppImage from '~/components/AppImage.vue'

export default {
  components: {
    AppImage
  },
  data() {
    return {
      drawer: null,
      activeIndex: 0,
      navs: [
        {
          title: 'Schedule',
          icon: 'event',
          names: ['index', 'event'],
          path: '/'
        },
        {
          title: 'Member',
          icon: 'account_circle',
          names: ['members', 'member'],
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
    ...mapState('member', ['members'])
  },
  watch: {
    $route() {
      this.updateActiveIndex()
    }
  },
  created() {
    this.updateActiveIndex()
  },
  methods: {
    onTabClick(e, nav) {
      this.$router.push(nav.path)
    },
    getTileClass(member) {
      const { id } = this.$route.query
      return { 'primary--text': member.id === id }
    },
    updateActiveIndex() {
      this.activeIndex = this.navs.findIndex((nav) =>
        nav.names.includes(this.$route.name)
      )
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
