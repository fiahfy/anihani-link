<template>
  <v-app
    :class="{
      'xs-only': $vuetify.breakpoint.xsOnly,
      'sm-and-up': $vuetify.breakpoint.smAndUp,
      'lg-and-up': $vuetify.breakpoint.lgAndUp
    }"
  >
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item v-for="(nav, index) in navs" :key="index" :to="nav.path">
          <v-list-item-action>
            <v-icon>{{ nav.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="nav.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list subheader>
        <v-subheader class="text-uppercase">Members</v-subheader>
        <v-list-item
          v-for="member in members"
          :key="member.id"
          :to="'/member?id=' + member.id"
          exact
        >
          <v-list-item-avatar color="grey darken-4">
            <app-image :src="`/img/members/${member.id}_48x48.png`" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="member.name_ja" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon
        class="hidden-xs-only"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title class="d-flex align-center">
        <img src="/icon_transparent.png" height="44" class="mb-1" />
        <span>{{ title }}</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content class="fill-height overflow-y-auto">
      <nuxt />
    </v-content>

    <v-footer app height="56" class="hidden-sm-and-up pa-0">
      <v-bottom-navigation grow :value="activeIndex">
        <v-btn
          v-for="(nav, index) of navs"
          :key="index"
          color="primary"
          text
          @click="(e) => onTabClick(e, nav)"
        >
          <span>{{ nav.title }}</span>
          <v-icon>{{ nav.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
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
          title: 'Calendar',
          icon: 'mdi-calendar',
          names: ['index'],
          path: '/'
        },
        {
          title: 'Schedule',
          icon: 'mdi-clock',
          names: ['schedule', 'event'],
          path: '/schedule'
        },
        {
          title: 'Member',
          icon: 'mdi-account-circle',
          names: ['members', 'member'],
          path: '/members'
        },
        {
          title: 'About',
          icon: 'mdi-help-circle',
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
    updateActiveIndex() {
      this.activeIndex = this.navs.findIndex((nav) =>
        nav.names.includes(this.$route.name)
      )
    }
  }
}
</script>

<style scoped>
.v-navigation-drawer {
  padding-left: env(safe-area-inset-left) !important;
}
.v-toolbar {
  padding-top: env(safe-area-inset-top) !important;
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-left) !important;
}
.v-content {
  padding-top: calc(56px + env(safe-area-inset-top)) !important;
  padding-bottom: calc(56px + env(safe-area-inset-bottom)) !important;
}
.v-footer {
  height: calc(56px + env(safe-area-inset-bottom)) !important;
}
.v-item-group.v-bottom-navigation {
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
}
.v-item-group.v-bottom-navigation > .v-btn {
  min-width: unset;
}
.xs-only .v-toolbar__title:not(:first-child) {
  padding-left: 0 !important;
}
.sm-and-up .v-content {
  padding-bottom: 0 !important;
}
.lg-and-up .v-navigation-drawer {
  max-height: calc(100% - 64px) !important;
}
</style>
